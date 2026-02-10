'use client'

import { motion } from 'framer-motion'
import { ChefCircle } from './ChefCircle'
import type { Chef } from '@/types/database'

interface ChefCarouselProps {
  chefs: Chef[]
}

export function ChefCarousel({ chefs }: ChefCarouselProps) {
  return (
    <div className="w-full overflow-hidden py-4">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-2xl font-bold text-[#2D5A27]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Våra Kockar
        </h2>
        <a href="/chefs" className="text-sm text-[#E85D04] font-medium hover:underline">
          Se alla →
        </a>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <motion.div 
          className="flex gap-6 px-6 pb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {chefs.map((chef) => (
            <ChefCircle key={chef.id} chef={chef} />
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
