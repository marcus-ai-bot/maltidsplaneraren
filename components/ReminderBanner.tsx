'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReminderBannerProps {
  message: string
  emoji?: string
  action?: () => void
  actionLabel?: string
}

export default function ReminderBanner({ message, emoji = '🔔', action, actionLabel = 'OK' }: ReminderBannerProps) {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
      >
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4">
          <div className="text-4xl">{emoji}</div>
          <div className="flex-1">
            <p className="font-semibold">{message}</p>
          </div>
          <div className="flex gap-2">
            {action && (
              <button
                onClick={() => {
                  action()
                  setShow(false)
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full font-semibold transition"
              >
                {actionLabel}
              </button>
            )}
            <button
              onClick={() => setShow(false)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
