'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeTutorial from '@/components/SwipeTutorial'

const DAYS = [
  { key: 'mon', label: 'Måndag' },
  { key: 'tue', label: 'Tisdag' },
  { key: 'wed', label: 'Onsdag' },
  { key: 'thu', label: 'Torsdag' },
  { key: 'fri', label: 'Fredag' },
  { key: 'sat', label: 'Lördag' },
  { key: 'sun', label: 'Söndag' },
]

const EATING_OPTIONS = [
  { value: 'home', label: 'Hemma', emoji: '🏠' },
  { value: 'out', label: 'Ute', emoji: '🍽️' },
  { value: 'lunch_box', label: 'Matlåda', emoji: '🥗' },
  { value: 'light', label: 'Lätt', emoji: '🌿' },
]

const TIME_OPTIONS = [
  { value: 'early', label: 'Tidigt', emoji: '⏰' },
  { value: 'late', label: 'Sent', emoji: '🌙' },
]

interface DayPlan {
  eating_status: string | null
  time_availability: string | null
}

export default function PlanningPage() {
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [plans, setPlans] = useState<Record<string, DayPlan>>(
    DAYS.reduce((acc, day) => {
      acc[day.key] = { eating_status: null, time_availability: null }
      return acc
    }, {} as Record<string, DayPlan>)
  )
  const [view, setView] = useState<'swipe' | 'grid'>('swipe')
  const [dragOffset, setDragOffset] = useState(0)

  const currentDay = DAYS[currentDayIndex]
  const currentPlan = plans[currentDay.key]

  const handleEatingSelect = (value: string) => {
    setPlans((prev) => ({
      ...prev,
      [currentDay.key]: { ...prev[currentDay.key], eating_status: value },
    }))
  }

  const handleTimeSelect = (value: string) => {
    setPlans((prev) => ({
      ...prev,
      [currentDay.key]: { ...prev[currentDay.key], time_availability: value },
    }))

    // Auto-advance to next day if all fields are filled
    if (currentDayIndex < DAYS.length - 1) {
      setTimeout(() => {
        setCurrentDayIndex((prev) => prev + 1)
      }, 300)
    }
  }

  const handlePrev = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentDayIndex < DAYS.length - 1) {
      setCurrentDayIndex((prev) => prev + 1)
    }
  }

  const handleSave = async () => {
    // TODO: Save to Supabase
    alert('Veckoplan sparad! Genererar AI-förslag...')
    // Redirect to calendar to see suggestions
    window.location.href = '/calendar'
  }

  const handleRandomWeek = () => {
    // Randomize all days with typical patterns
    const randomPlans = DAYS.reduce((acc, day) => {
      const isWeekend = day.key === 'sat' || day.key === 'sun'
      acc[day.key] = {
        eating_status: isWeekend ? 'home' : Math.random() > 0.3 ? 'home' : 'out',
        time_availability: Math.random() > 0.5 ? 'early' : 'late',
      }
      return acc
    }, {} as Record<string, DayPlan>)
    setPlans(randomPlans)
    alert('Veckan slumpad! 🎲')
  }

  const handleCopyLastWeek = () => {
    // TODO: Fetch last week's plan from Supabase
    alert('Kopierar förra veckans planering...')
  }

  if (view === 'grid') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white border-b border-neutral-200 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl">←</Link>
            <h1 className="text-xl font-bold">Veckoplannering</h1>
            <button
              onClick={() => setView('swipe')}
              className="text-sm text-green-600 font-medium"
            >
              Swipe
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid gap-4">
            {DAYS.map((day) => {
              const plan = plans[day.key]
              return (
                <div key={day.key} className="bg-white rounded-xl p-4 shadow-md">
                  <h3 className="font-bold mb-3">{day.label}</h3>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {EATING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setPlans((prev) => ({
                            ...prev,
                            [day.key]: { ...prev[day.key], eating_status: opt.value },
                          }))
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          plan.eating_status === opt.value
                            ? 'bg-green-500 text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {opt.emoji} {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {TIME_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setPlans((prev) => ({
                            ...prev,
                            [day.key]: { ...prev[day.key], time_availability: opt.value },
                          }))
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          plan.time_availability === opt.value
                            ? 'bg-emerald-500 text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {opt.emoji} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full shadow-lg transition"
          >
            Spara veckoplan
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <SwipeTutorial />
      
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold">Veckoplannering</h1>
          <button
            onClick={() => setView('grid')}
            className="text-sm text-green-600 font-medium"
          >
            Grid
          </button>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3 overflow-x-auto">
          <button
            onClick={handleRandomWeek}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full whitespace-nowrap transition shadow-md"
          >
            🎲 Slumpa veckan
          </button>
          <button
            onClick={handleCopyLastWeek}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full whitespace-nowrap transition shadow-md"
          >
            🔄 Samma som förra veckan
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-1">
            {DAYS.map((day, idx) => (
              <div
                key={day.key}
                className={`flex-1 h-2 rounded-full transition ${
                  idx < currentDayIndex
                    ? 'bg-green-500'
                    : idx === currentDayIndex
                    ? 'bg-green-300'
                    : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main swipe content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDayIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDrag={(_, info) => setDragOffset(info.offset.x)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100 && currentDayIndex < DAYS.length - 1) {
                setCurrentDayIndex((prev) => prev + 1)
              } else if (info.offset.x > 100 && currentDayIndex > 0) {
                setCurrentDayIndex((prev) => prev - 1)
              }
              setDragOffset(0)
            }}
            className="bg-white rounded-2xl p-8 shadow-lg cursor-grab active:cursor-grabbing"
          >
            <h2 className="text-3xl font-bold text-center mb-8">{currentDay.label}</h2>

            {/* Eating status */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Var äter du?</h3>
              <div className="grid grid-cols-2 gap-3">
                {EATING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleEatingSelect(option.value)}
                    className={`p-6 rounded-xl border-2 transition ${
                      currentPlan.eating_status === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time availability */}
            {currentPlan.eating_status && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h3 className="font-semibold text-lg mb-4">När har du tid?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {TIME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeSelect(option.value)}
                      className={`p-6 rounded-xl border-2 transition ${
                        currentPlan.time_availability === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{option.emoji}</div>
                      <div className="font-semibold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentDayIndex === 0}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 text-neutral-700 font-semibold py-3 rounded-full transition"
              >
                ← Föregående
              </button>
              {currentDayIndex === DAYS.length - 1 ? (
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
                >
                  Spara ✓
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
                >
                  Nästa →
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Thursday reminder */}
        {currentDay.key === 'thu' && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-sm text-amber-800">
            💡 <strong>Tips:</strong> Torsdagar kl 19:00 är planeringstid!
          </div>
        )}
      </main>
    </div>
  )
}
