import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL krävs' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY saknas' },
        { status: 503 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

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

    // Extract recipe using Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Du är en expert på att extrahera receptinformation från HTML.
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

Svara ENDAST med valid JSON utan markdown-formatering eller extra text.

HTML att extrahera från:
${html.slice(0, 15000)}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Oväntat svar från AI' }, { status: 500 })
    }

    // Parse JSON (handle potential markdown wrapping)
    let jsonStr = content.text.trim()
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7)
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3)
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3)
    }

    const recipeData = JSON.parse(jsonStr)

    const recipe = {
      id: `recipe-${Date.now()}`,
      source_url: url,
      source_name: new URL(url).hostname.replace('www.', ''),
      ...recipeData,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Recipe extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Kunde inte extrahera recept' },
      { status: 500 }
    )
  }
}
