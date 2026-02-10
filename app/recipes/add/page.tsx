'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddRecipePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExtract = async () => {
    if (!url.trim()) {
      setError('Ange en URL')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/recipes/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Kunde inte extrahera recept')
      }

      const recipe = await response.json()
      router.push(`/recipes/${recipe.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/recipes" className="text-2xl">
            ←
          </Link>
          <h1 className="text-xl font-bold">Lägg till recept</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="font-bold text-lg mb-4">Klistra in recept-URL</h2>
          <p className="text-neutral-600 text-sm mb-4">
            Fungerar med de flesta receptsajter (t.ex. Catarina König, 56kilo, ICA, Arla)
          </p>

          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-neutral-300 text-white font-semibold py-3 rounded-full transition"
          >
            {isLoading ? 'Extraherar...' : 'Lägg till recept'}
          </button>
        </div>

        {/* Examples */}
        <div className="mt-8">
          <h3 className="font-bold mb-3">Exempel-sajter som fungerar:</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>✓ catarinakonig.elle.se</li>
            <li>✓ 56kilo.se</li>
            <li>✓ ica.se/recept</li>
            <li>✓ arla.se/recept</li>
            <li>✓ koket.se</li>
          </ul>
        </div>

        {/* Manual entry (future) */}
        <div className="mt-8 p-4 bg-neutral-100 rounded-xl text-center text-neutral-500 text-sm">
          Manuell receptinmatning kommer snart!
        </div>
      </main>
    </div>
  )
}
