import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="px-6 py-8 text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <h1 className="text-4xl font-bold mb-4">🍽️ Måltidsplaneraren</h1>
        <p className="text-lg opacity-90 max-w-md mx-auto">
          AI-driven måltidsplanering för par. Smart, enkel, och skitgod mat.
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receptbank */}
          <Link 
            href="/recipes" 
            className="recipe-card bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg"
          >
            <div className="text-5xl mb-4">📖</div>
            <h2 className="text-2xl font-bold mb-2">Receptbank</h2>
            <p className="text-neutral-600">
              Bläddra bland hundratals fantastiska recept
            </p>
          </Link>

          {/* Veckoplannering */}
          <Link 
            href="/planning" 
            className="recipe-card bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg"
          >
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-2xl font-bold mb-2">Veckoplannering</h2>
            <p className="text-neutral-600">
              Swipea dig till perfekt vecka
            </p>
          </Link>

          {/* Middagsförslag */}
          <Link 
            href="/suggestions" 
            className="recipe-card bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg"
          >
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-2">Smart förslag</h2>
            <p className="text-neutral-600">
              AI föreslår middagar baserat på er vardag
            </p>
          </Link>

          {/* Inköpslista */}
          <Link 
            href="/shopping" 
            className="recipe-card bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg"
          >
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Inköpslista</h2>
            <p className="text-neutral-600">
              Automatiskt från veckans recept
            </p>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            href="/auth" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition"
          >
            Kom igång →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-neutral-500 text-sm">
        <p>Skapad med ❤️ av Molt för Marcus & Ingela</p>
      </footer>
    </div>
  )
}
