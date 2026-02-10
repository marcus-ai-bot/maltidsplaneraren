'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ShoppingItem {
  id: string
  name: string
  amount: string
  unit: string
  category: string
  checked: boolean
  recipeTitle: string
}

const CATEGORIES = [
  { key: 'meat', label: 'Kött & Fisk', emoji: '🥩' },
  { key: 'dairy', label: 'Mejeri', emoji: '🥛' },
  { key: 'vegetables', label: 'Grönsaker', emoji: '🥬' },
  { key: 'pantry', label: 'Skafferi', emoji: '🏺' },
  { key: 'other', label: 'Övrigt', emoji: '🛒' },
]

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadShoppingList()
  }, [])

  const loadShoppingList = async () => {
    // TODO: Generate from week's recipes
    // Mock data for now
    const mockItems: ShoppingItem[] = [
      { id: '1', name: 'Kycklingfilé', amount: '400', unit: 'g', category: 'meat', checked: false, recipeTitle: 'Kycklingwok' },
      { id: '2', name: 'Laxfilé', amount: '300', unit: 'g', category: 'meat', checked: false, recipeTitle: 'Lördagsmiddag' },
      { id: '3', name: 'Grädde', amount: '2', unit: 'dl', category: 'dairy', checked: false, recipeTitle: 'Pasta Carbonara' },
      { id: '4', name: 'Parmesan', amount: '100', unit: 'g', category: 'dairy', checked: true, recipeTitle: 'Pasta Carbonara' },
      { id: '5', name: 'Broccoli', amount: '1', unit: 'st', category: 'vegetables', checked: false, recipeTitle: 'Kycklingwok' },
      { id: '6', name: 'Paprika röd', amount: '2', unit: 'st', category: 'vegetables', checked: false, recipeTitle: 'Kycklingwok' },
    ]
    setItems(mockItems)
    setLoading(false)
  }

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const groupedItems = CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((item) => item.category === category.key),
  })).filter((group) => group.items.length > 0)

  const checkedCount = items.filter((i) => i.checked).length
  const totalCount = items.length

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl">←</Link>
          <div className="text-center">
            <h1 className="text-xl font-bold">Inköpslista</h1>
            <p className="text-sm text-neutral-600">
              {checkedCount} / {totalCount} varor
            </p>
          </div>
          <button className="text-green-600 font-medium text-sm">
            Dela
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(checkedCount / totalCount) * 100}%` }}
              transition={{ type: 'spring', damping: 15 }}
            />
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded mb-2" />
                <div className="h-3 bg-neutral-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {groupedItems.map((group) => (
              <div key={group.key} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="bg-neutral-100 px-4 py-3 font-bold flex items-center gap-2">
                  <span className="text-2xl">{group.emoji}</span>
                  <span>{group.label}</span>
                  <span className="ml-auto text-sm text-neutral-600">
                    {group.items.filter((i) => i.checked).length} / {group.items.length}
                  </span>
                </div>
                <div className="divide-y divide-neutral-100">
                  {group.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-neutral-50 transition"
                      onClick={() => toggleItem(item.id)}
                      animate={{ opacity: item.checked ? 0.5 : 1 }}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          item.checked
                            ? 'bg-green-500 border-green-500'
                            : 'border-neutral-300'
                        }`}
                      >
                        {item.checked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${item.checked ? 'line-through' : ''}`}>
                          {item.name}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {item.amount} {item.unit} · {item.recipeTitle}
                        </div>
                      </div>
                      {item.checked && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Har hemma
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {!loading && (
          <div className="mt-6 space-y-3">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full shadow-lg transition">
              📤 Exportera till butik-app
            </button>
            <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 rounded-full transition">
              📸 Scanna kyl (kommer snart)
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
