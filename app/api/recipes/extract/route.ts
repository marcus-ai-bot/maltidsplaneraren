import { NextRequest, NextResponse } from 'next/server'

// Simple GET for health check
export async function GET() {
  return NextResponse.json({ status: 'ok', route: 'recipes/extract' })
}

export async function POST(request: NextRequest) {
  console.log('[EXTRACT] Route handler started')
  
  // Quick early return for debugging
  const testMode = request.headers.get('x-test-mode')
  if (testMode) {
    try {
      const body = await request.json()
      const { url } = body
      
      if (testMode === 'echo') {
        return NextResponse.json({ echo: body, status: 'handler reached' })
      }
      
      if (testMode === 'keys') {
        return NextResponse.json({ 
          hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
          hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
          url 
        })
      }
      
      if (testMode === 'fetch') {
        const resp = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Test/1.0)' }
        })
        return NextResponse.json({ 
          fetchOk: resp.ok, 
          status: resp.status,
          contentType: resp.headers.get('content-type')?.slice(0, 50)
        })
      }
    } catch (e) {
      return NextResponse.json({ error: 'test failed', details: String(e) })
    }
  }
  
  try {
    const body = await request.json()
    console.log('[EXTRACT] Body parsed:', JSON.stringify(body).slice(0, 100))
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL krävs' }, { status: 400 })
    }

    // Check for API keys at runtime (not build time!)
    const openRouterKey = process.env.OPENROUTER_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    if (!openRouterKey && !anthropicKey) {
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

    if (anthropicKey) {
      // Use Anthropic directly
      const { default: Anthropic } = await import('@anthropic-ai/sdk')
      const anthropic = new Anthropic({ apiKey: anthropicKey })
      
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }],
      })
      
      const content = message.content[0]
      if (content.type !== 'text') {
        return NextResponse.json({ error: 'Oväntat svar från AI' }, { status: 500 })
      }
      jsonStr = content.text.trim()
    } else {
      // Use OpenRouter
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
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2048,
        }),
      })
      
      const orData = await orResponse.json()
      
      // Check for OpenRouter errors
      if (!orResponse.ok || orData.error) {
        console.error('OpenRouter error:', orData)
        return NextResponse.json(
          { error: orData.error?.message || `OpenRouter fel: ${orResponse.status}` },
          { status: 502 }
        )
      }
      
      jsonStr = orData.choices?.[0]?.message?.content?.trim() || ''
      
      if (!jsonStr) {
        console.error('OpenRouter empty response:', orData)
        return NextResponse.json(
          { error: 'OpenRouter returnerade tomt svar' },
          { status: 502 }
        )
      }
    }

    // Parse JSON (handle potential markdown wrapping)
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7)
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3)
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3)
    jsonStr = jsonStr.trim()

    let recipeData
    try {
      recipeData = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('JSON parse error. Response was:', jsonStr.slice(0, 500))
      return NextResponse.json(
        { error: 'Kunde inte tolka AI-svar som JSON', raw: jsonStr.slice(0, 200) },
        { status: 500 }
      )
    }

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
