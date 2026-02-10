import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const WHITELIST = [
  'marcus@isaksson.cc',
  'ingela.lidstrom73@gmail.com',
  'molt@isaksson.cc',
]

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check whitelist
    if (!WHITELIST.includes(normalizedEmail)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // TODO: Generate magic link token and save to database
    // For now, we'll just simulate sending email
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=dummy-token-${Date.now()}`

    // Send email via Resend
    if (resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@maltidsplaneraren.app',
        to: normalizedEmail,
        subject: 'Din magic link till Måltidsplaneraren',
        html: `
          <h1>Välkommen till Måltidsplaneraren!</h1>
          <p>Klicka på länken nedan för att logga in:</p>
          <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Logga in
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Länken är giltig i 1 timme.
          </p>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 })
  }
}
