import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ChefCarousel } from '@/components/ChefCarousel'
import { RecipeCard } from '@/components/RecipeCard'
import { SearchBar } from '@/components/SearchBar'
import type { Database } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function RecipesPage() {
  const supabase = createClient()

  // Fetch chefs for carousel
  const { data: chefs } = await supabase
    .from('chefs')
    .select('*')
    .order('is_verified', { ascending: false })
    .order('follower_count', { ascending: false })
    .limit(10)

  // Fetch recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2D5A27] to-[#3a7033] text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Receptbank
            </h1>
            <Link
              href="/recipes/add"
              className="bg-[#E85D04] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d14d03] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>

          <p className="text-white/90 text-center">
            Din personliga kokbok med världens bästa kockar
          </p>
        </div>
      </header>

      {/* Chef Carousel */}
      {chefs && chefs.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <ChefCarousel chefs={chefs} />
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <SearchBar
            onSearch={(query) => {
              console.log('Search:', query)
              // TODO: Implement search
            }}
            onFilterChange={(filters) => {
              console.log('Filters:', filters)
              // TODO: Implement filtering
            }}
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">
            Alla recept
          </h2>
          <p className="text-neutral-600">
            {recipes?.length || 0} recept
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes?.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onAddClick={(recipe) => {
                console.log('Add to plan:', recipe.id)
                // TODO: Implement add to weekly plan
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {!recipes || recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Inga recept än
            </h3>
            <p className="text-neutral-600 mb-6">
              Lägg till ditt första recept för att komma igång!
            </p>
            <Link
              href="/recipes/add"
              className="inline-block bg-[#2D5A27] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3a7033] transition-colors"
            >
              Lägg till recept
            </Link>
          </div>
        )}
      </main>

      {/* Floating Add Button (mobile) */}
      <Link
        href="/recipes/add"
        className="fixed bottom-6 right-6 md:hidden bg-[#E85D04] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#d14d03] transition-colors z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  )
}
