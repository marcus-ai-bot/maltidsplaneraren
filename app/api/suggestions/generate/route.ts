import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { householdId, startDate } = await request.json()

    if (!householdId || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for API keys at runtime
    const openRouterKey = process.env.OPENROUTER_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    
    if (!openRouterKey && !anthropicKey) {
      return NextResponse.json(
        { error: 'Ingen AI-nyckel konfigurerad' },
        { status: 503 }
      )
    }

    const supabase = createClient()

    // Get day plans for the week
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    const { data: dayPlans, error: plansError } = await supabase
      .from('day_plans')
      .select('*')
      .eq('household_id', householdId)
      .gte('date', startDate)
      .lte('date', endDate.toISOString().split('T')[0])

    if (plansError) {
      return NextResponse.json({ error: plansError.message }, { status: 500 })
    }

    // Get available recipes
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .limit(50)

    if (recipesError) {
      return NextResponse.json({ error: recipesError.message }, { status: 500 })
    }

    // Build AI prompt
    const prompt = `Du är en AI-kock som planerar middagar för en vecka.

VECKOPLANERING:
${dayPlans
  ?.map(
    (plan) =>
      `${plan.date}: ${plan.eating_status || 'okänd'} (${plan.time_availability || 'okänd tid'})`
  )
  .join('\n')}

TILLGÄNGLIGA RECEPT:
${recipes?.slice(0, 20).map((r) => `- ${r.title} (${r.prep_time_minutes || '?'} min, ${r.difficulty || 'medel'}) [id: ${r.id}]`).join('\n')}

REGLER:
- Båda hemma + tidigt = Marcus lagar (enkelt recept <30 min)
- Båda hemma + sent = snabbt & enkelt (max 20 min)
- En ute = lätt middag för den hemma
- Fredag = lite extra, gärna något kul
- Lördag = festligt, gärna 2-rätters
- Undvik recept som fått <3 stjärnor senaste 2 veckorna

Generera 7 middagsförslag (måndag-söndag) med:
1. recipe_id (hitta från listan ovan)
2. reason (kort förklaring varför detta recept passar dagen)

Svara ENDAST med JSON array, ingen markdown:
[{"date": "2026-02-10", "recipe_id": "uuid-från-listan", "reason": "text"}]`

    let responseText: string

    if (anthropicKey) {
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const anthropic = new Anthropic({ apiKey: anthropicKey })
      
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      })
      
      const content = message.content[0]
      if (content.type !== 'text') {
        return NextResponse.json({ error: 'Oväntat svar från AI' }, { status: 500 })
      }
      responseText = content.text.trim()
    } else {
      const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://maltidsplaneraren.vercel.app',
          'X-Title': 'Måltidsplaneraren',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        }),
      })
      const orData = await orResponse.json()
      responseText = orData.choices?.[0]?.message?.content?.trim() || ''
    }

    // Parse JSON (handle potential markdown wrapping)
    let jsonStr = responseText
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7)
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3)
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3)
    jsonStr = jsonStr.trim()

    const suggestions = JSON.parse(jsonStr)

    // Save suggestions to database
    const { data: savedSuggestions, error: saveError } = await supabase
      .from('meal_suggestions')
      .insert(
        suggestions.map((s: any) => ({
          household_id: householdId,
          date: s.date,
          recipe_id: s.recipe_id,
          reason: s.reason,
          status: 'suggested',
        }))
      )
      .select()

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 })
    }

    return NextResponse.json({ suggestions: savedSuggestions })
  } catch (error: any) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
