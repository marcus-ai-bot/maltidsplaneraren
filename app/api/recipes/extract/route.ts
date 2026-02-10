import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Use OpenRouter as proxy to access GPT-4 and other models
const openai = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://maltidsplaneraren.vercel.app',
        'X-Title': 'Måltidsplaneraren',
      },
    })
  : process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    : null

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 503 }
      )
    }

    // Fetch the webpage
    const response = await fetch(url)
    const html = await response.text()

    // Extract recipe using OpenAI (via OpenRouter or direct)
    const model = process.env.OPENROUTER_API_KEY 
      ? 'openai/gpt-4-turbo' 
      : 'gpt-4-turbo-preview'
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Du är en expert på att extrahera receptinformation från HTML.
Extrahera följande fält från receptet:
- title (string)
- description (string)
- image_url (string, första bild)
- category (string: "förrätt", "varmrätt", "dessert")
- tags (array: ex ["low-carb", "vegetariskt", "snabb"])
- difficulty (string: "enkel", "medel", "avancerad")
- prep_time_minutes (number)
- cook_time_minutes (number)
- servings (number)
- ingredients (array av {name, amount, unit})
- steps (array av strängar)
- suitable_for_lunch_box (boolean)
- is_light_meal (boolean)

Svara ENDAST med valid JSON utan extra text.`,
        },
        {
          role: 'user',
          content: `Extrahera recept från denna HTML:\n\n${html.slice(0, 10000)}`,
        },
      ],
    })

    const recipeData = JSON.parse(completion.choices[0].message.content || '{}')

    // TODO: Save to Supabase
    // For now, return the extracted data with a mock ID
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
      { error: 'Failed to extract recipe' },
      { status: 500 }
    )
  }
}
