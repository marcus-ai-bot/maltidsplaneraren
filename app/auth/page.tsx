'use client'

import { useState } from 'react'
import Link from 'next/link'

const WHITELIST = [
  'marcus@isaksson.cc',
  'ingela.lidstrom73@gmail.com',
  'molt@isaksson.cc',
]

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Ange din e-postadress')
      return
    }

    if (!WHITELIST.includes(email.toLowerCase().trim())) {
      setError('Du är inte inbjuden till denna app ännu!')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Kunde inte skicka magic link')
      }

      setIsSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">📬</div>
          <h1 className="text-2xl font-bold mb-4">Kolla din e-post!</h1>
          <p className="text-neutral-600 mb-6">
            Vi har skickat en magic link till <strong>{email}</strong>
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Länken är giltig i 1 timme. Klicka på den för att logga in.
          </p>
          <button
            onClick={() => {
              setIsSent(false)
              setEmail('')
            }}
            className="text-green-600 font-medium hover:underline"
          >
            Skicka till annan e-post →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Logo/title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-3xl font-bold mb-2">Måltidsplaneraren</h1>
          <p className="text-neutral-600">Logga in för att komma igång</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendLink}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              E-postadress
            </label>
            <input
              id="email"
              type="email"
              placeholder="din@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-neutral-300 text-white font-semibold py-3 rounded-full transition"
          >
            {isLoading ? 'Skickar...' : 'Skicka magic link'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600">
          <p className="font-semibold mb-2">🔒 Säker inloggning</p>
          <p>
            Vi skickar en engångslänk till din e-post. Inget lösenord behövs! Sessionen gäller i 7
            dagar.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-neutral-500 text-sm hover:underline">
            ← Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  )
}
