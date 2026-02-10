'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data (will be replaced with Supabase query)
const mockRecipes = [
  {
    id: '1',
    title: 'Krämig pasta carbonara',
    description: 'Klassisk italiensk pastarätt med ägg, bacon och parmesan',
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    category: 'varmrätt',
    tags: ['snabb', 'enkel'],
    difficulty: 'enkel',
    prep_time_minutes: 10,
    cook_time_minutes: 20,
  },
  {
    id: '2',
    title: 'Grillad lax med grönsaker',
    description: 'Hälsosam och god laxfilé med rostade grönsaker',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    category: 'varmrätt',
    tags: ['low-carb', 'lättlagad'],
    difficulty: 'enkel',
    prep_time_minutes: 15,
    cook_time_minutes: 25,
  },
  {
    id: '3',
    title: 'Vegetarisk lasagne',
    description: 'Smakrik lasagne med spenat, ricotta och tomatsås',
    image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
    category: 'varmrätt',
    tags: ['vegetariskt', 'festlig'],
    difficulty: 'medel',
    prep_time_minutes: 30,
    cook_time_minutes: 45,
  },
]

const categories = ['Alla', 'Förrätt', 'Varmrätt', 'Dessert']
const filters = ['Alla', 'Low-carb', 'Snabb', 'Enkel', 'Vegetarisk']

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Alla')
  const [selectedFilter, setSelectedFilter] = useState('Alla')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-2xl">←</Link>
            <h1 className="text-xl font-bold">Receptbank</h1>
            <Link href="/recipes/add" className="text-2xl">+</Link>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Sök recept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="sticky top-[120px] z-10 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[180px] z-10 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedFilter === filter
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="recipe-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg"
            >
              <div className="relative h-48 bg-neutral-200">
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
                {/* Tags */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {recipe.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {recipe.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span>⏱️ {recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                  <span>👨‍🍳 {recipe.difficulty}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Add recipe button (floating) */}
        <Link
          href="/recipes/add"
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition"
        >
          +
        </Link>
      </main>
    </div>
  )
}
