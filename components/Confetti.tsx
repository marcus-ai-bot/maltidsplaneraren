'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  show: boolean
  onComplete?: () => void
}

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; color: string; rotation: number }>>([])

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#E85D04', '#2D5A27', '#F5E6D3', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
      }))
      setPieces(newPieces)

      setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 3000)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: piece.rotation + 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: 'easeIn',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  )
}
