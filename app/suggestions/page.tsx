'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Mock suggestion
const mockSuggestion = {
  date: '2026-02-10',
  recipe: {
    id: '1',
    title: 'Krämig pasta carbonara',
    description: 'Klassisk italiensk pastarätt med ägg, bacon och parmesan',
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200',
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    difficulty: 'enkel',
    tags: ['snabb', 'enkel', 'italienskt'],
  },
  reason:
    'Både ni är hemma tidigt idag! Jag föreslår en enkel och snabb middag som Marcus kan fixa. Carbonara är klassiker som alltid fungerar och tar bara 30 minuter. Perfekt för en avslappnad måndagskväll!',
  alternatives: [
    {
      id: '2',
      title: 'Grillad lax med grönsaker',
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    },
    {
      id: '3',
      title: 'Vegetarisk lasagne',
      image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
    },
  ],
}

export default function SuggestionsPage() {
  const [isSwapping, setIsSwapping] = useState(false)

  const handleAccept = () => {
    // TODO: Save to meal_suggestions table
    alert('Middagen är planerad!')
  }

  const handleSwap = () => {
    setIsSwapping(true)
    // TODO: Navigate to Tinder-style swipe view
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl">
            ←
          </Link>
          <h1 className="text-xl font-bold">Smart förslag</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Date selector */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <h2 className="font-semibold mb-3">Välj dag</h2>
          <div className="flex gap-2 overflow-x-auto">
            {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day, idx) => (
              <button
                key={day}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  idx === 0
                    ? 'bg-green-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6"
        >
          {/* Image */}
          <div className="relative h-64 bg-neutral-200">
            <Image
              src={mockSuggestion.recipe.image_url}
              alt={mockSuggestion.recipe.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {mockSuggestion.recipe.tags.slice(0, 2).map((tag) => (
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
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{mockSuggestion.recipe.title}</h2>
            <p className="text-neutral-600 mb-4">{mockSuggestion.recipe.description}</p>

            <div className="flex gap-4 text-sm text-neutral-600 mb-6">
              <span>
                ⏱️{' '}
                {mockSuggestion.recipe.prep_time_minutes + mockSuggestion.recipe.cook_time_minutes} min
              </span>
              <span>👨‍🍳 {mockSuggestion.recipe.difficulty}</span>
            </div>

            {/* AI Reasoning */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-emerald-900 mb-2 flex items-center">
                <span className="mr-2">🤖</span> Varför detta recept?
              </h3>
              <p className="text-emerald-800 text-sm">{mockSuggestion.reason}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
              >
                ✓ Acceptera
              </button>
              <button
                onClick={handleSwap}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-full transition"
              >
                🔄 Byt recept
              </button>
            </div>
          </div>
        </motion.div>

        {/* Alternatives */}
        <div>
          <h3 className="font-bold text-lg mb-3">Andra alternativ</h3>
          <div className="grid grid-cols-2 gap-4">
            {mockSuggestion.alternatives.map((alt) => (
              <Link
                key={alt.id}
                href={`/recipes/${alt.id}`}
                className="recipe-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg"
              >
                <div className="relative h-32 bg-neutral-200">
                  <Image src={alt.image_url} alt={alt.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2">{alt.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View all recipes */}
        <Link
          href="/recipes"
          className="block mt-6 text-center text-green-600 font-medium hover:underline"
        >
          Se alla recept →
        </Link>
      </main>
    </div>
  )
}
