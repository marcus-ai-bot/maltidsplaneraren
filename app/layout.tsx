import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Måltidsplaneraren',
  description: 'AI-driven måltidsplanerare för par',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className="antialiased bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  )
}
