'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Chef } from '@/types/database'

interface ChefCircleProps {
  chef: Chef
}

export function ChefCircle({ chef }: ChefCircleProps) {
  return (
    <Link href={`/chefs/${chef.slug}`}>
      <motion.div
        className="flex flex-col items-center gap-2 min-w-[100px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Avatar Circle */}
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#2D5A27] shadow-lg"
            whileHover={{ borderColor: '#E85D04' }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={chef.avatar_url || '/placeholder-chef.jpg'}
              alt={chef.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Verified Badge */}
          {chef.is_verified && (
            <div className="absolute -bottom-1 -right-1 bg-[#E85D04] rounded-full p-1">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-800 line-clamp-2 max-w-[90px]">
            {chef.name}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
