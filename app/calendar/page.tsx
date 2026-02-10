'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RecipeCard from '@/components/RecipeCard'
import Confetti from '@/components/Confetti'
import ReminderBanner from '@/components/ReminderBanner'

const DAYS = ['Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör', 'Sön']

interface MealSuggestion {
  id: string
  date: string
  recipe: {
    id: string
    title: string
    image_url?: string
    prep_time_minutes?: number
    difficulty?: string
  }
  reason: string
  status: string
}

export default function CalendarPage() {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedRecipe, setMatchedRecipe] = useState<any>(null)
  const [reminder, setReminder] = useState<string | null>(null)

  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    // TODO: Fetch from Supabase
    // Mock data for now
    setLoading(false)
  }

  const handleGenerateWeek = async () => {
    setLoading(true)
    
    // TODO: Call /api/suggestions/generate
    setTimeout(() => {
      setLoading(false)
      setShowConfetti(true)
    }, 2000)
  }

  const handleSwipeRecipe = (suggestionId: string, accepted: boolean) => {
    if (accepted) {
      // Update status to 'accepted'
      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestionId ? { ...s, status: 'accepted' } : s))
      )
      
      // Show match animation
      const suggestion = suggestions.find((s) => s.id === suggestionId)
      if (suggestion) {
        setMatchedRecipe(suggestion.recipe)
        setShowMatch(true)
        setShowConfetti(true)
      }
    } else {
      // Replace with new recipe
      // TODO: Call API to get alternative
    }
  }

  const handleMeatReminder = () => {
    // Simulate checking for meat reminder
    // In production, this would call /api/reminders/meat
    setReminder('Ta ut kycklingen ur frysen! 🧊')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {reminder && (
        <ReminderBanner
          message={reminder}
          emoji="🥩"
          action={() => setReminder(null)}
          actionLabel="Tack!"
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">Kalendervy</h1>
          <button className="text-sm text-green-600 font-medium">
            Lista
          </button>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto">
          <button
            onClick={handleGenerateWeek}
            disabled={loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full whitespace-nowrap transition disabled:opacity-50"
          >
            🎲 Slumpa veckan
          </button>
          <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-full whitespace-nowrap transition">
            🔄 Samma som förra veckan
          </button>
          <button
            onClick={handleMeatReminder}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-full whitespace-nowrap transition"
          >
            🥩 Ta ut köttet
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button className="p-2">←</button>
          <span className="font-bold">Vecka 7, 2026</span>
          <button className="p-2">→</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 h-64 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded mb-4" />
                <div className="h-32 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {DAYS.map((day, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border-2 border-dashed border-neutral-300 p-4 h-64 flex flex-col items-center justify-center hover:border-green-400 transition cursor-pointer"
              >
                <div className="text-4xl mb-2">+</div>
                <div className="font-bold text-neutral-700">{day}</div>
                <div className="text-sm text-neutral-500 mt-2">Lägg till recept</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {suggestions.map((suggestion, i) => (
              <div key={suggestion.id} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="p-3 bg-neutral-100 font-bold text-center text-sm">
                  {DAYS[i]}
                </div>
                <div className="relative h-40 bg-neutral-200">
                  {suggestion.recipe.image_url ? (
                    <img
                      src={suggestion.recipe.image_url}
                      alt={suggestion.recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🍽️
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm mb-1">{suggestion.recipe.title}</h4>
                  <div className="text-xs text-neutral-600">
                    {suggestion.recipe.prep_time_minutes} min · {suggestion.recipe.difficulty}
                  </div>
                  {suggestion.status === 'suggested' && (
                    <button
                      onClick={() => handleSwipeRecipe(suggestion.id, false)}
                      className="mt-2 w-full text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-1 rounded transition"
                    >
                      Byt recept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Match Modal */}
      {showMatch && matchedRecipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
          onClick={() => setShowMatch(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">IT'S A MATCH!</h2>
            <p className="text-neutral-600 mb-6">
              Du och Ingela valde samma recept
            </p>
            <div className="relative h-48 bg-neutral-200 rounded-xl mb-4 overflow-hidden">
              {matchedRecipe.image_url ? (
                <img
                  src={matchedRecipe.image_url}
                  alt={matchedRecipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🍽️
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-6">{matchedRecipe.title}</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMatch(false)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 rounded-full transition"
              >
                Stäng
              </button>
              <Link
                href={`/recipes/${matchedRecipe.id}`}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition text-center"
              >
                Se recept
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
