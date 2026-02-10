'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    title: 'Veckoplanering',
    description: 'Swipe dig genom veckan',
    icon: '📅',
    href: '/planning',
    color: 'from-green-400 to-green-600',
  },
  {
    title: 'Kalendervy',
    description: 'Översikt över hela veckan',
    icon: '📆',
    href: '/calendar',
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: 'Receptbank',
    description: 'Dina sparade recept',
    icon: '📖',
    href: '/recipes',
    color: 'from-orange-400 to-orange-600',
  },
  {
    title: 'Inköpslista',
    description: 'Auto-genererad från veckan',
    icon: '🛒',
    href: '/shopping',
    color: 'from-purple-400 to-purple-600',
  },
  {
    title: 'AI-förslag',
    description: 'Få middagsinspiration',
    icon: '🤖',
    href: '/suggestions',
    color: 'from-pink-400 to-pink-600',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
          >
            Måltidsplaneraren
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center text-neutral-600 mt-2"
          >
            Aldrig mer "vad ska vi äta?"
          </motion.p>
        </div>
      </header>

      {/* Main Menu */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.href}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', damping: 15 }}
            >
              <Link href={feature.href}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer group">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4">Denna vecka</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="text-sm text-neutral-600">Middagar planerade</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-sm text-neutral-600">Varor att handla</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">3</div>
              <div className="text-sm text-neutral-600">Nya recept</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex gap-3"
        >
          <Link
            href="/planning"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl text-center shadow-lg transition"
          >
            🎯 Planera veckan
          </Link>
          <Link
            href="/calendar"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl text-center shadow-lg transition"
          >
            📅 Se kalendern
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-neutral-500 text-sm">
        <p>Måltidsplaneraren v2.0 — Blow Me Away Edition 💫</p>
      </footer>
    </div>
  )
}
