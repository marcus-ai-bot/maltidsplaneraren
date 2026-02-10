'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange?: (filters: SearchFilters) => void
}

export interface SearchFilters {
  maxTime?: number
  difficulty?: string
  tags?: string[]
}

const quickFilters = [
  { label: 'Alla', value: 'all' },
  { label: 'Under 30min', value: 'quick', maxTime: 30 },
  { label: 'Low-carb', value: 'lowcarb', tags: ['low-carb', 'lchf'] },
  { label: 'Vegetariskt', value: 'vegetarian', tags: ['vegetariskt'] },
  { label: 'Festligt', value: 'fancy', tags: ['festligt'] },
]

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterClick = (filter: typeof quickFilters[0]) => {
    setActiveFilter(filter.value)
    if (onFilterChange) {
      onFilterChange({
        maxTime: filter.maxTime,
        tags: filter.tags,
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Sök efter recept..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 pr-12 rounded-full border-2 border-neutral-200 focus:border-[#2D5A27] focus:outline-none transition-colors"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Advanced Filter Toggle */}
        <motion.button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-neutral-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </motion.button>
      </form>

      {/* Quick Filter Chips */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {quickFilters.map((filter) => (
            <motion.button
              key={filter.value}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.value
                  ? 'bg-[#2D5A27] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-[#F5E6D3] rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-neutral-800 mb-4">
                Avancerade filter
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tillagningstid
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#2D5A27] focus:outline-none">
                    <option value="">Alla tider</option>
                    <option value="0-15">0-15 min</option>
                    <option value="15-30">15-30 min</option>
                    <option value="30-60">30-60 min</option>
                    <option value="60+">60+ min</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Svårighetsgrad
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:border-[#2D5A27] focus:outline-none">
                    <option value="">Alla nivåer</option>
                    <option value="enkel">Enkel</option>
                    <option value="medel">Medel</option>
                    <option value="avancerad">Avancerad</option>
                  </select>
                </div>
              </div>

              {/* AI Search Placeholder */}
              <div className="mt-4 pt-4 border-t border-neutral-300">
                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path
                      fillRule="evenodd"
                      d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>AI-sök kommer snart - beskriv vad du vill laga!</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
