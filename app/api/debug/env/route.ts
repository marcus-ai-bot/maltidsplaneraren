import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    // Don't expose actual keys, just check if they exist
    openRouterKeyPrefix: process.env.OPENROUTER_API_KEY?.slice(0, 10),
  })
}
