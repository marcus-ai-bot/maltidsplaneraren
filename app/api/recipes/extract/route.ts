import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/client'

// Support both direct Anthropic and OpenRouter (routing to Claude)
const getClient = () => {
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      type: 'anthropic' as const,
      client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
      model: 'claude-sonnet-4-20250514',
    }
  }
  if (process.env.OPENROUTER_API_KEY) {
    return {
      type: 'openrouter' as const,
      apiKey: process.env.OPENROUTER_API_KEY,
      model: 'anthropic/claude-sonnet-4',
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL krävs' }, { status: 400 })
    }

    const config = getClient()
    if (!config) {
      return NextResponse.json(
        { error: 'Ingen AI-nyckel konfigurerad (ANTHROPIC_API_KEY eller OPENROUTER_API_KEY)' },
        { status: 503 }
      )
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Maltidsplaneraren/1.0)',
      },
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Kunde inte hämta sidan: ${response.status}` },
        { status: 400 }
      )
    }
    
    const html = await response.text()

    const systemPrompt = `Du är en expert på att extrahera receptinformation från HTML.
Extrahera följande fält från receptet:
- title (string)
- description (string, kort sammanfattning)
- image_url (string, hitta första relevanta receptbilden, ofta i og:image eller recipe-bild)
- category (string: "förrätt", "varmrätt", "dessert", "bakverk", "dryck")
- tags (array: ex ["low-carb", "vegetariskt", "snabb", "helg"])
- difficulty (string: "enkel", "medel", "avancerad")
- prep_time_minutes (number)
- cook_time_minutes (number)
- servings (number)
- ingredients (array av {name, amount, unit})
- steps (array av strängar med instruktioner)
- suitable_for_lunch_box (boolean)
- is_light_meal (boolean)

Svara ENDAST med valid JSON utan markdown-formatering eller extra text.`

    const userPrompt = `Extrahera recept från denna HTML:\n\n${html.slice(0, 15000)}`

    let jsonStr: string

    if (config.type === 'anthropic') {
      const message = await config.client.messages.create({
        model: config.model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }],
      })
      const content = message.content[0]
      if (content.type !== 'text') {
        return NextResponse.json({ error: 'Oväntat svar från AI' }, { status: 500 })
      }
      jsonStr = content.text.trim()
    } else {
      // OpenRouter
      const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://maltidsplaneraren.vercel.app',
          'X-Title': 'Måltidsplaneraren',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2048,
        }),
      })
      const orData = await orResponse.json()
      jsonStr = orData.choices?.[0]?.message?.content?.trim() || ''
    }

    // Parse JSON (handle potential markdown wrapping)
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7)
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3)
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3)
    jsonStr = jsonStr.trim()

    const recipeData = JSON.parse(jsonStr)

    // Save to Supabase
    const supabase = createClient()
    const { data: savedRecipe, error: dbError } = await supabase
      .from('recipes')
      .insert({
        title: recipeData.title,
        description: recipeData.description,
        image_url: recipeData.image_url,
        source_url: url,
        source_name: new URL(url).hostname.replace('www.', ''),
        category: recipeData.category,
        tags: recipeData.tags || [],
        difficulty: recipeData.difficulty || 'medel',
        prep_time_minutes: recipeData.prep_time_minutes,
        cook_time_minutes: recipeData.cook_time_minutes,
        servings: recipeData.servings || 4,
        ingredients: recipeData.ingredients || [],
        steps: recipeData.steps || [],
        suitable_for_lunch_box: recipeData.suitable_for_lunch_box || false,
        is_light_meal: recipeData.is_light_meal || false,
        is_fancy: false, // Default value
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: `Kunde inte spara recept: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(savedRecipe)
  } catch (error) {
    console.error('Recipe extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Kunde inte extrahera recept' },
      { status: 500 }
    )
  }
}
