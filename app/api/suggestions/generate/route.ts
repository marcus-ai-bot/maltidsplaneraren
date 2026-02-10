import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { householdId, startDate } = await request.json()

    if (!householdId || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    // Get recent ratings to avoid repetition
    const { data: recentRatings } = await supabase
      .from('recipe_ratings')
      .select('recipe_id, rating')
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())

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
${recipes?.slice(0, 20).map((r) => `- ${r.title} (${r.prep_time_minutes || '?'} min, ${r.difficulty || 'medel'})`).join('\n')}

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

Svara ENDAST med JSON:
[{"date": "2026-02-10", "recipe_id": "uuid", "reason": "text"}]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const suggestions = JSON.parse(completion.choices[0].message.content || '[]')

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
