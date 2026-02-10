'use client'

import { motion } from 'framer-motion'

interface WeekTemplate {
  id: string
  name: string
  description: string
  emoji: string
  uses: number
}

interface WeekTemplateCardProps {
  template: WeekTemplate
  onSelect: () => void
}

export function WeekTemplateCard({ template, onSelect }: WeekTemplateCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition text-left w-full"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">{template.emoji}</div>
        <div className="flex-1">
          <h4 className="font-bold">{template.name}</h4>
          <p className="text-sm text-neutral-600">{template.description}</p>
        </div>
      </div>
      <div className="text-xs text-neutral-500">
        Använd {template.uses} gånger
      </div>
    </motion.button>
  )
}

interface WeekTemplateModalProps {
  show: boolean
  templates: WeekTemplate[]
  onSelect: (template: WeekTemplate) => void
  onClose: () => void
  onSaveNew: () => void
}

export function WeekTemplateModal({ show, templates, onSelect, onClose, onSaveNew }: WeekTemplateModalProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Veckomallar</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 mb-6">
          {templates.map((template) => (
            <WeekTemplateCard
              key={template.id}
              template={template}
              onSelect={() => {
                onSelect(template)
                onClose()
              }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            onSaveNew()
            onClose()
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
        >
          💾 Spara nuvarande vecka som mall
        </button>
      </motion.div>
    </motion.div>
  )
}
