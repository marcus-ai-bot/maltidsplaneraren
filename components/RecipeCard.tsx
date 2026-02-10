'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface Recipe {
  id: string
  title: string
  image_url?: string
  prep_time_minutes?: number
  difficulty?: string
  servings?: number
}

interface RecipeCardProps {
  recipe: Recipe
  reason?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  showReason?: boolean
}

export default function RecipeCard({ recipe, reason, onSwipeLeft, onSwipeRight, showReason }: RecipeCardProps) {
  return (
    <motion.div
      drag={onSwipeLeft && onSwipeRight ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          onSwipeRight?.()
        } else if (info.offset.x < -100) {
          onSwipeLeft?.()
        }
      }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 0.95 }}
    >
      {/* Recipe Image */}
      <div className="relative h-64 bg-neutral-200">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍽️
          </div>
        )}
      </div>

      {/* Recipe Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
        
        <div className="flex gap-3 text-sm text-neutral-600 mb-4">
          {recipe.prep_time_minutes && (
            <span>⏱️ {recipe.prep_time_minutes} min</span>
          )}
          {recipe.difficulty && (
            <span>📊 {recipe.difficulty}</span>
          )}
          {recipe.servings && (
            <span>👥 {recipe.servings} port</span>
          )}
        </div>

        {/* AI Reasoning */}
        {showReason && reason && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">🤖</span>
              <div className="flex-1">
                <p className="text-sm text-neutral-700 italic">{reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {onSwipeLeft && onSwipeRight && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={onSwipeLeft}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 rounded-full transition"
            >
              ← Byt recept
            </button>
            <button
              onClick={onSwipeRight}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
            >
              ✓ Perfekt!
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
