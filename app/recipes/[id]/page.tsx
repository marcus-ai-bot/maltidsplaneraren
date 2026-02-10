'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'

// Mock recipe data
const mockRecipe = {
  id: '1',
  title: 'Krämig pasta carbonara',
  description: 'Klassisk italiensk pastarätt med ägg, bacon och parmesan. Perfekt vardagsmiddag som går snabbt att laga.',
  image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200',
  source_name: 'Catarina König',
  source_url: 'https://catarinakonig.elle.se',
  category: 'varmrätt',
  tags: ['snabb', 'enkel', 'italienskt'],
  difficulty: 'enkel',
  prep_time_minutes: 10,
  cook_time_minutes: 20,
  servings: 4,
  ingredients: [
    { name: 'Spaghetti', amount: '400', unit: 'g' },
    { name: 'Bacon', amount: '200', unit: 'g' },
    { name: 'Ägg', amount: '4', unit: 'st' },
    { name: 'Parmesanost', amount: '100', unit: 'g' },
    { name: 'Svartpeppar', amount: '1', unit: 'tsk' },
    { name: 'Salt', amount: '', unit: 'efter smak' },
  ],
  steps: [
    'Koka spaghetti enligt anvisning på förpackningen.',
    'Stek bacon tills den är krispig, ta bort från pannan och hacka grovt.',
    'Vispa ihop ägg, riven parmesan och svartpeppar i en skål.',
    'När pastan är klar, häll av vattnet men spara 1 dl pastavatten.',
    'Blanda pastan med äggblandningen utanför värmen (annars blir äggen äggröra!)',
    'Tillsätt lite pastavatten om det behövs för rätt konsistens.',
    'Vänd ner bacon och servera direkt med extra parmesan.',
  ],
  is_light_meal: false,
  suitable_for_lunch_box: true,
}

export default function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [rating, setRating] = useState<number | null>(null)

  const handleRate = (stars: number) => {
    setRating(stars)
    // TODO: Save to Supabase
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 bg-neutral-200">
        <Image
          src={mockRecipe.image_url}
          alt={mockRecipe.title}
          fill
          className="object-cover"
          priority
        />
        <Link
          href="/recipes"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl shadow-lg"
        >
          ←
        </Link>
        {/* Tags overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          {mockRecipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Title & Meta */}
        <h1 className="text-3xl font-bold mb-3">{mockRecipe.title}</h1>
        <p className="text-neutral-600 mb-4">{mockRecipe.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-6">
          <span>⏱️ {mockRecipe.prep_time_minutes + mockRecipe.cook_time_minutes} min</span>
          <span>👨‍🍳 {mockRecipe.difficulty}</span>
          <span>🍽️ {mockRecipe.servings} portioner</span>
          {mockRecipe.suitable_for_lunch_box && <span>📦 Passar som matlåda</span>}
        </div>

        {/* Source */}
        {mockRecipe.source_name && (
          <p className="text-sm text-neutral-500 mb-6">
            Källa:{' '}
            <a
              href={mockRecipe.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {mockRecipe.source_name}
            </a>
          </p>
        )}

        {/* Rating */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h2 className="font-bold text-lg mb-3">Betygsätt receptet</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                onClick={() => handleRate(stars)}
                className="text-3xl transition hover:scale-110"
              >
                {rating && stars <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          {rating && (
            <p className="mt-2 text-sm text-neutral-600">
              Du gav {rating} stjärn{rating > 1 ? 'or' : 'a'}!
            </p>
          )}
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h2 className="font-bold text-xl mb-4">Ingredienser</h2>
          <ul className="space-y-2">
            {mockRecipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-3 text-green-500">✓</span>
                <span>
                  <span className="font-medium">{ingredient.name}</span>
                  {ingredient.amount && (
                    <span className="text-neutral-600">
                      {' '}
                      — {ingredient.amount} {ingredient.unit}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h2 className="font-bold text-xl mb-4">Instruktioner</h2>
          <ol className="space-y-4">
            {mockRecipe.steps.map((step, idx) => (
              <li key={idx} className="flex">
                <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  {idx + 1}
                </span>
                <p className="pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full shadow-lg transition">
            Lägg till i veckans plan
          </button>
          <button className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-3 rounded-full transition">
            Spara favorit
          </button>
        </div>
      </main>
    </div>
  )
}
