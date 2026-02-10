import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { householdId, date } = await request.json()

    if (!householdId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Get tomorrow's meal
    const { data: suggestion, error } = await supabase
      .from('meal_suggestions')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('household_id', householdId)
      .eq('date', date)
      .eq('status', 'accepted')
      .single()

    if (error || !suggestion) {
      return NextResponse.json({ needsReminder: false })
    }

    const recipe = suggestion.recipe
    if (!recipe || !recipe.ingredients) {
      return NextResponse.json({ needsReminder: false })
    }

    // Check if recipe contains frozen meat/fish
    const hasMeat = recipe.ingredients.some((ingredient: any) => {
      const name = ingredient.name.toLowerCase()
      return name.match(/kyckling|kött|fläsk|nöt|lamm|fisk|lax|torsk/)
    })

    if (hasMeat) {
      // TODO: In production, send push notification via OneSignal/FCM
      // For now, return reminder data
      return NextResponse.json({
        needsReminder: true,
        recipe: recipe.title,
        message: `Ta ut ${recipe.title} ur frysen! 🧊`,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      })
    }

    return NextResponse.json({ needsReminder: false })
  } catch (error: any) {
    console.error('Error checking meat reminder:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
