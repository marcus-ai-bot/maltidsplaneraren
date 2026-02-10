# 🍽️ Måltidsplaneraren

AI-driven måltidsplanerare för par. Smart, enkel, och skitgod mat.

## Features (MVP)

- ✅ **Receptbank** - Bläddra bland hundratals recept med bilder
- ✅ **Sök & Filter** - Hitta recept efter kategori, tags (low-carb, snabb, enkel, etc.)
- ✅ **Lägg till recept** - Klistra in URL, AI extraherar receptet
- ✅ **Veckoplannering** - Swipe-baserat flöde för att planera veckan
- ✅ **Smart middagsförslag** - AI föreslår middagar baserat på er vardag
- ✅ **Recept-byte** - Tinder-style swipe för att byta recept
- ✅ **Inköpslista** - Automatiskt genererad från veckans recept
- ✅ **Betygsättning** - 1-5 stjärnor på lagade recept
- ✅ **Auth** - Magic link inloggning (whitelist)

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (Postgres + Auth + Storage)
- **AI:** OpenAI GPT-4 för receptextraktion och förslag
- **Email:** Resend
- **Hosting:** Vercel

## Setup

```bash
# Install dependencies
npm install

# Copy .env.local.example to .env.local and fill in values
cp .env.local.example .env.local

# Run development server
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database

Se `supabase/migrations/` för databasschema.

Kör migrationer:
```bash
supabase db push
```

## Scraping

Receptscraping från:
- Catarina König (catarinakonig.elle.se)
- 56kilo.se (low carb)

Scraping-skript kommer snart!

## Deploy

```bash
vercel deploy
```

## Roadmap

### V1.0 (MVP) ✅
- Receptbank med sök
- Veckoplannering
- Smart förslag
- Inköpslista
- Auth

### V1.1
- Bildanalys av kyl/skafferi
- Push-notiser
- Kalender-integration

### V2.0 (SaaS)
- Multi-tenant (flera hushåll)
- Drink-förslag
- Förrätt/efterrätt
- Pricing tiers

---

**Skapad med ❤️ av Molt för Marcus & Ingela**
