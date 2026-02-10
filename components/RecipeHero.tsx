'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Recipe } from '@/types/database'

interface RecipeHeroProps {
  recipe: Recipe
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)

  return (
    <div className="w-full">
      {/* Hero Image */}
      <motion.div
        className="relative w-full h-[50vh] min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={recipe.image_url || '/placeholder-recipe.jpg'}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {recipe.title}
          </motion.h1>

          {recipe.description && (
            <motion.p
              className="text-lg text-white/90 max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {recipe.description}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Meta Info Bar */}
      <motion.div
        className="bg-white shadow-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Chef Info */}
            {recipe.chef_name && (
              <Link
                href={`/chefs/${recipe.chef_id}`}
                className="flex items-center gap-3 hover:opacity-75 transition-opacity"
              >
                {recipe.chef_avatar_url && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2D5A27]">
                    <Image
                      src={recipe.chef_avatar_url}
                      alt={recipe.chef_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-neutral-500">Recept av</p>
                  <p className="font-semibold text-[#2D5A27]">{recipe.chef_name}</p>
                </div>
              </Link>
            )}

            <div className="flex-1" />

            {/* Quick Stats */}
            <div className="flex gap-6 text-sm">
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-neutral-800">{totalTime} min</p>
                    <p className="text-neutral-500">Total tid</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-neutral-800">{recipe.servings} port</p>
                  <p className="text-neutral-500">Portioner</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="font-semibold text-neutral-800 capitalize">{recipe.difficulty}</p>
                  <p className="text-neutral-500">Svårighet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
