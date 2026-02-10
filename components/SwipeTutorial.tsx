'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SwipeTutorial() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenSwipeTutorial')
    if (!hasSeenTutorial) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    localStorage.setItem('hasSeenSwipeTutorial', 'true')
  }

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-2xl p-8 max-w-md text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-6xl mb-4">👆</div>
          <h2 className="text-2xl font-bold mb-4">Swipe för att navigera!</h2>
          <p className="text-neutral-600 mb-6">
            Swipe åt vänster eller höger för att gå mellan dagar. Eller använd knapparna!
          </p>
          <motion.div
            animate={{
              x: [-20, 20, -20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold">Swipe mig!</div>
            </div>
          </motion.div>
          <button
            onClick={handleClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
          >
            Fattar! 👍
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
