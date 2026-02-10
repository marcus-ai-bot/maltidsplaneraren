import { createClient } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
// import { RecipeHero } from '@/components/RecipeHero'
import type { Database } from '@/types/database'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params
  const supabase = createClient()

  // Fetch recipe
  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (!recipe) {
    notFound()
  }

  // Parse ingredients
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === 'string'
    ? JSON.parse(recipe.ingredients)
    : []

  // Parse steps
  const steps = Array.isArray(recipe.steps)
    ? recipe.steps
    : typeof recipe.steps === 'string'
    ? JSON.parse(recipe.steps)
    : []

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Back Button (Fixed) */}
      <Link
        href="/recipes"
        className="fixed top-6 left-6 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
      >
        <svg className="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      {/* Hero Section */}
      {/* <RecipeHero recipe={recipe} /> */}
      <div className="bg-neutral-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          {recipe.description && <p className="text-lg text-neutral-300">{recipe.description}</p>}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">
                Ingredienser
              </h2>
              <p className="text-sm text-neutral-600 mb-4">
                För {recipe.servings} portioner
              </p>

              <div className="space-y-3">
                {ingredients.map((ingredient: any, idx: number) => (
                  <label
                    key={idx}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 rounded border-2 border-[#2D5A27] text-[#2D5A27] focus:ring-[#2D5A27]"
                    />
                    <span className="flex-1 group-hover:text-[#2D5A27] transition-colors">
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.amount && (
                        <span className="text-neutral-600 text-sm">
                          <br />
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>

              {/* Add to Shopping List */}
              <button className="w-full mt-6 px-4 py-3 bg-[#F5E6D3] text-[#2D5A27] font-semibold rounded-full hover:bg-[#e8d6bf] transition-colors">
                Lägg till i inköpslista
              </button>
            </div>
          </div>

          {/* Right Column - Instructions */}
          <div className="lg:col-span-2">
            {/* Instructions */}
            <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                Instruktioner
              </h2>

              <div className="space-y-6">
                {steps.map((step: any, idx: number) => {
                  const instruction = typeof step === 'string' ? step : step.instruction
                  const duration = typeof step === 'object' ? step.duration_minutes : null

                  return (
                    <div key={idx} className="flex gap-4">
                      {/* Step Number */}
                      <div className="flex-shrink-0 w-10 h-10 bg-[#2D5A27] text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-1">
                        <p className="text-neutral-800 leading-relaxed mb-2">
                          {instruction}
                        </p>

                        {/* Timer Button (if duration exists) */}
                        {duration && (
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#E85D04] text-white text-sm font-medium rounded-full hover:bg-[#d14d03] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Timer {duration} min
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tags & Meta */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  Taggar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-[#F5E6D3] text-[#2D5A27] text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.suitable_for_lunch_box && (
                    <span className="px-4 py-2 bg-[#F5E6D3] text-[#2D5A27] text-sm font-medium rounded-full">
                      📦 Matlådevänlig
                    </span>
                  )}
                  {recipe.is_fancy && (
                    <span className="px-4 py-2 bg-[#F5E6D3] text-[#2D5A27] text-sm font-medium rounded-full">
                      ✨ Festlig
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Source */}
            {recipe.source_name && (
              <div className="text-center text-sm text-neutral-600">
                Recept från{' '}
                {recipe.source_url ? (
                  <a
                    href={recipe.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2D5A27] hover:text-[#E85D04] font-medium transition-colors"
                  >
                    {recipe.source_name}
                  </a>
                ) : (
                  <span className="font-medium">{recipe.source_name}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 lg:hidden">
          <div className="flex gap-3 max-w-md mx-auto">
            <button className="flex-1 bg-[#2D5A27] text-white font-semibold py-3 rounded-full hover:bg-[#3a7033] transition-colors">
              Lägg till i veckoplan
            </button>
            <button className="w-12 h-12 flex-shrink-0 bg-[#F5E6D3] text-[#E85D04] rounded-full flex items-center justify-center hover:bg-[#e8d6bf] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Action Bar */}
        <div className="hidden lg:flex gap-4 mt-12">
          <button className="flex-1 bg-[#2D5A27] text-white font-semibold py-4 rounded-full hover:bg-[#3a7033] transition-colors">
            Lägg till i veckoplan
          </button>
          <button className="flex-1 bg-[#F5E6D3] text-[#2D5A27] font-semibold py-4 rounded-full hover:bg-[#e8d6bf] transition-colors">
            Spara som favorit
          </button>
        </div>
      </main>
    </div>
  )
}
