import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const images = formData.getAll('images') as File[]
    const mainImageIndex = parseInt(formData.get('mainImageIndex') as string || '0', 10)

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'Minst en bild krävs' }, { status: 400 })
    }

    if (images.length > 4) {
      return NextResponse.json({ error: 'Max 4 bilder' }, { status: 400 })
    }

    // Get the main image for the recipe
    const mainImage = images[mainImageIndex] || images[0]

    // Convert images to base64
    const imageContents = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        const mimeType = image.type || 'image/jpeg'
        return {
          type: 'image_url' as const,
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
          },
        }
      })
    )

    const openRouterKey = process.env.OPENROUTER_API_KEY
    if (!openRouterKey) {
      return NextResponse.json({ error: 'AI-nyckel saknas' }, { status: 503 })
    }

    const systemPrompt = `Du är en expert på att extrahera receptinformation från bilder.
Analysera bilden/bilderna och extrahera receptinformation.
Om det är flera bilder, kombinera informationen till ETT recept.

Extrahera följande fält:
- title (string)
- description (string, kort sammanfattning)
- category (string: "förrätt", "varmrätt", "dessert", "bakverk", "dryck")
- tags (array: ex ["low-carb", "vegetariskt", "snabb", "helg"])
- difficulty (string: "enkel", "medel", "avancerad")
- prep_time_minutes (number eller null)
- cook_time_minutes (number eller null)
- servings (number eller null)
- ingredients (array av {name, amount, unit})
- steps (array av strängar med instruktioner)
- suitable_for_lunch_box (boolean)
- is_light_meal (boolean)

Om något saknas i bilden, gissa rimligt baserat på recepttypen.
Svara ENDAST med valid JSON utan markdown-formatering.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://maltidsplaneraren.vercel.app',
        'X-Title': 'Måltidsplaneraren',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',  // Billig + bra på bilder
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extrahera receptet från dessa bilder:' },
              ...imageContents,
            ],
          },
        ],
        max_tokens: 2048,
      }),
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      console.error('OpenRouter error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'AI-fel' },
        { status: 502 }
      )
    }

    let jsonStr = data.choices?.[0]?.message?.content?.trim() || ''
    
    // Parse JSON (handle potential markdown wrapping)
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7)
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3)
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3)
    jsonStr = jsonStr.trim()

    let recipeData
    try {
      recipeData = JSON.parse(jsonStr)
    } catch {
      console.error('JSON parse error:', jsonStr.slice(0, 500))
      return NextResponse.json(
        { error: 'Kunde inte tolka AI-svar', raw: jsonStr.slice(0, 200) },
        { status: 500 }
      )
    }

    // Save to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Databas ej konfigurerad' }, { status: 503 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Upload main image to Supabase Storage
    let imageUrl: string | null = null
    try {
      const imageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const ext = mainImage.name.split('.').pop() || 'jpg'
      const imagePath = `recipes/${imageId}.${ext}`
      
      const imageBuffer = await mainImage.arrayBuffer()
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(imagePath, imageBuffer, {
          contentType: mainImage.type || 'image/jpeg',
          upsert: false,
        })

      if (uploadError) {
        console.error('Image upload error:', uploadError)
      } else {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(imagePath)
        imageUrl = urlData.publicUrl
      }
    } catch (uploadErr) {
      console.error('Image upload failed:', uploadErr)
      // Continue without image - not a fatal error
    }

    const recipeToSave = {
      title: recipeData.title,
      description: recipeData.description,
      image_url: imageUrl,
      source_name: 'Bilduppladdning',
      category: recipeData.category,
      tags: recipeData.tags || [],
      difficulty: recipeData.difficulty,
      prep_time_minutes: recipeData.prep_time_minutes,
      cook_time_minutes: recipeData.cook_time_minutes,
      servings: recipeData.servings,
      ingredients: recipeData.ingredients || [],
      steps: recipeData.steps || [],
      suitable_for_lunch_box: recipeData.suitable_for_lunch_box || false,
      is_light_meal: recipeData.is_light_meal || false,
    }

    const { data: savedRecipe, error: saveError } = await supabase
      .from('recipes')
      .insert(recipeToSave)
      .select()
      .single()

    if (saveError) {
      console.error('Supabase error:', saveError)
      return NextResponse.json(
        { error: `Kunde inte spara: ${saveError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(savedRecipe)
  } catch (error) {
    console.error('Image extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Något gick fel' },
      { status: 500 }
    )
  }
}
