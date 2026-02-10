'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ShoppingItem {
  id: string
  ingredient: string
  quantity: string
  unit: string
  status: 'to_buy' | 'have_at_home' | 'bought'
  source_recipe: string
}

const mockItems: ShoppingItem[] = [
  {
    id: '1',
    ingredient: 'Spaghetti',
    quantity: '400',
    unit: 'g',
    status: 'to_buy',
    source_recipe: 'Pasta carbonara',
  },
  {
    id: '2',
    ingredient: 'Bacon',
    quantity: '200',
    unit: 'g',
    status: 'to_buy',
    source_recipe: 'Pasta carbonara',
  },
  {
    id: '3',
    ingredient: 'Ägg',
    quantity: '4',
    unit: 'st',
    status: 'have_at_home',
    source_recipe: 'Pasta carbonara',
  },
  {
    id: '4',
    ingredient: 'Parmesanost',
    quantity: '100',
    unit: 'g',
    status: 'to_buy',
    source_recipe: 'Pasta carbonara',
  },
  {
    id: '5',
    ingredient: 'Laxfilé',
    quantity: '600',
    unit: 'g',
    status: 'to_buy',
    source_recipe: 'Grillad lax',
  },
  {
    id: '6',
    ingredient: 'Broccoli',
    quantity: '1',
    unit: 'st',
    status: 'to_buy',
    source_recipe: 'Grillad lax',
  },
]

type FilterType = 'all' | 'to_buy' | 'have_at_home' | 'bought'

export default function ShoppingPage() {
  const [items, setItems] = useState(mockItems)
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredItems =
    filter === 'all' ? items : items.filter((item) => item.status === filter)

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'to_buy'
              ? 'bought'
              : item.status === 'bought'
              ? 'have_at_home'
              : 'to_buy'
          return { ...item, status: nextStatus }
        }
        return item
      })
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'to_buy':
        return '○'
      case 'bought':
        return '✓'
      case 'have_at_home':
        return '🏠'
      default:
        return '○'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_buy':
        return 'text-neutral-400'
      case 'bought':
        return 'text-green-500'
      case 'have_at_home':
        return 'text-blue-500'
      default:
        return 'text-neutral-400'
    }
  }

  const toBuyCount = items.filter((i) => i.status === 'to_buy').length
  const boughtCount = items.filter((i) => i.status === 'bought').length
  const haveCount = items.filter((i) => i.status === 'have_at_home').length

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl">
            ←
          </Link>
          <h1 className="text-xl font-bold">Inköpslista</h1>
          <button className="text-sm text-green-600 font-medium">Dela</button>
        </div>
      </header>

      {/* Filter tabs */}
      <div className="sticky top-[72px] z-10 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Alla ({items.length})
          </button>
          <button
            onClick={() => setFilter('to_buy')}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === 'to_buy'
                ? 'bg-amber-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Ska köpas ({toBuyCount})
          </button>
          <button
            onClick={() => setFilter('bought')}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === 'bought'
                ? 'bg-green-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Köpt ({boughtCount})
          </button>
          <button
            onClick={() => setFilter('have_at_home')}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === 'have_at_home'
                ? 'bg-blue-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Har hemma ({haveCount})
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Inga varor i denna kategori</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 ${
                  idx !== filteredItems.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`text-2xl ${getStatusColor(item.status)} transition`}
                >
                  {getStatusIcon(item.status)}
                </button>
                <div className="flex-1">
                  <div
                    className={`font-semibold ${
                      item.status === 'bought' ? 'line-through text-neutral-400' : ''
                    }`}
                  >
                    {item.ingredient}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {item.quantity} {item.unit} • {item.source_recipe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 rounded-full transition">
            Töm köpt
          </button>
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition">
            Generera om
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <p className="font-semibold mb-2">💡 Tips:</p>
          <p>Tryck på en vara för att växla mellan "ska köpas", "köpt" och "har hemma".</p>
        </div>
      </main>
    </div>
  )
}
