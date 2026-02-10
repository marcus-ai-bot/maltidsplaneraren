import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { householdId, startDate, endDate } = await request.json()

    if (!householdId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Get accepted meal suggestions for the week
    const { data: suggestions, error: suggestionsError } = await supabase
      .from('meal_suggestions')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('household_id', householdId)
      .eq('status', 'accepted')
      .gte('date', startDate)
      .lte('date', endDate)

    if (suggestionsError) {
      return NextResponse.json({ error: suggestionsError.message }, { status: 500 })
    }

    // Aggregate ingredients from all recipes
    const shoppingList: any[] = []
    const ingredientMap = new Map<string, any>()

    suggestions?.forEach((suggestion: any) => {
      const recipe = suggestion.recipe
      if (!recipe || !recipe.ingredients) return

      recipe.ingredients.forEach((ingredient: any) => {
        const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`
        
        if (ingredientMap.has(key)) {
          // Combine amounts
          const existing = ingredientMap.get(key)
          existing.amount = parseFloat(existing.amount) + parseFloat(ingredient.amount)
          existing.recipes.push(recipe.title)
        } else {
          ingredientMap.set(key, {
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            category: categorizeIngredient(ingredient.name),
            recipes: [recipe.title],
          })
        }
      })
    })

    // Convert map to array
    ingredientMap.forEach((value, key) => {
      shoppingList.push({
        id: key,
        ...value,
      })
    })

    return NextResponse.json({ shoppingList })
  } catch (error: any) {
    console.error('Error generating shopping list:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function categorizeIngredient(name: string): string {
  const lowerName = name.toLowerCase()
  
  if (lowerName.match(/kyckling|kött|fläsk|nöt|lamm|fisk|lax|torsk|räk/)) {
    return 'meat'
  }
  if (lowerName.match(/mjölk|ost|grädde|yoghurt|smör|ägg/)) {
    return 'dairy'
  }
  if (lowerName.match(/tomat|gurka|sallad|paprika|lök|vitlök|morrot|broccoli|blomkål|potatis/)) {
    return 'vegetables'
  }
  if (lowerName.match(/pasta|ris|mjöl|socker|salt|peppar|olja|vinäger|sås/)) {
    return 'pantry'
  }
  
  return 'other'
}
