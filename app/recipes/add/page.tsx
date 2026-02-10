'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Mode = 'url' | 'image'

export default function AddRecipePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [mode, setMode] = useState<Mode>('url')
  const [url, setUrl] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 4) {
      setError('Max 4 bilder')
      return
    }
    
    setImages(prev => [...prev, ...files])
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
    setError(null)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleExtractUrl = async () => {
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

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte extrahera recept')
      }

      router.push(`/recipes/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExtractImages = async () => {
    if (images.length === 0) {
      setError('Välj minst en bild')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      images.forEach(img => formData.append('images', img))

      const response = await fetch('/api/recipes/extract-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte extrahera recept')
      }

      router.push(`/recipes/${data.id}`)
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
          <div className="w-6" />
        </div>
      </header>

      {/* Mode Toggle */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex bg-neutral-200 rounded-full p-1">
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition ${
              mode === 'url' 
                ? 'bg-white shadow text-green-600' 
                : 'text-neutral-600'
            }`}
          >
            🔗 Från URL
          </button>
          <button
            onClick={() => setMode('image')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition ${
              mode === 'image' 
                ? 'bg-white shadow text-green-600' 
                : 'text-neutral-600'
            }`}
          >
            📸 Från bild
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          
          {mode === 'url' ? (
            <>
              <h2 className="font-bold text-lg mb-2">Klistra in recept-URL</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Fungerar med de flesta receptsajter
              </p>

              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleExtractUrl}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-neutral-300 text-white font-semibold py-3 rounded-full transition"
              >
                {isLoading ? '⏳ Extraherar...' : '✨ Lägg till recept'}
              </button>
            </>
          ) : (
            <>
              <h2 className="font-bold text-lg mb-2">Ladda upp bilder</h2>
              <p className="text-neutral-600 text-sm mb-4">
                Ta screenshot från Instagram, TikTok eller fota ett recept
              </p>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative">
                      <img
                        src={preview}
                        alt={`Bild ${i + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />

              {images.length < 4 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-neutral-300 rounded-xl py-8 mb-4 text-neutral-500 hover:border-green-500 hover:text-green-600 transition"
                >
                  📷 Välj bilder ({images.length}/4)
                </button>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleExtractImages}
                disabled={isLoading || images.length === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-neutral-300 text-white font-semibold py-3 rounded-full transition"
              >
                {isLoading ? '⏳ Analyserar...' : '✨ Extrahera recept'}
              </button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <h3 className="font-bold text-green-800 mb-2">💡 Tips</h3>
          <ul className="text-sm text-green-700 space-y-1">
            {mode === 'url' ? (
              <>
                <li>• Funkar med Catarina König, 56kilo, ICA, Arla m.fl.</li>
                <li>• Instagram-länkar funkar om de leder till en blogg</li>
                <li>• Tracking-parametrar (utm_source etc) tas bort automatiskt</li>
              </>
            ) : (
              <>
                <li>• Ta screenshot av hela receptet</li>
                <li>• Flera bilder? Lägg till upp till 4 st</li>
                <li>• Funkar även med handskrivna recept!</li>
              </>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}
