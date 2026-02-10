# Måltidsplaneraren v2.0 - "Kitchen Stories Edition" 🎨

**Deployed:** 2026-02-10
**Build Time:** ~1 timme
**Theme:** Kitchen Stories + Pinchos-inspirerat

---

## ✨ Nya Features

### 🧑‍🍳 Chef Profiles
- **Horisontell carousel** på startsidan med kock-cirklar
- **Dedikerade kock-sidor** (`/chefs/[slug]`) med:
  - Hero-bild och avatar
  - Bio och stil-taggar
  - Alla kockens recept
  - Verified badge för officiella kockar
- **Kock-lista** (`/chefs`) med alla kockar
- **Demo-kockar:**
  - Catarina König (Nordiskt, Vardagsmat)
  - 56kilo by Anette (Low-carb, LCHF)

### 📖 Receptkort (Pinchos-stil)
- **70% bild** med gradient overlay
- **Floating "+" knapp** för att lägga till i veckoplan
- **Chef-avatar** i hörnet
- **Smooth hover-animationer** (Framer Motion)
- **Meta-info:** Tid, svårighet, portioner, betyg
- **Responsive** för mobil och desktop

### 🎬 Receptsida
- **Hero-sektion** med fullwidth-bild
- **Chef-info bar** med avatar och stats
- **Två-kolumns layout:**
  - Vänster: Ingredienser med checkboxes
  - Höger: Steg-för-steg instruktioner
- **Timer-knappar** på steg med tid
- **Taggar** och metadata
- **Sticky ingredient-lista** på desktop

### 🔍 Sökförbättring
- **Filter-chips** (horisontell scroll): Under 30min, Low-carb, Vegetariskt, Festligt
- **Avancerade filter** (slide-up panel):
  - Tid (0-15, 15-30, 30-60, 60+ min)
  - Svårighet (Enkel, Medel, Avancerad)
- **AI-sök placeholder** (kommer snart)

---

## 🎨 Design System

### Färger
```css
Primary:    #2D5A27  /* Grön - mat, fräscht */
Secondary:  #F5E6D3  /* Beige - varmt, hemma */
Accent:     #E85D04  /* Orange - CTA, highlights */
Background: #FAFAFA  /* Ljusgrå */
```

### Typografi
- **Headlines:** Playfair Display (serif, elegant)
- **Body:** Inter (sans-serif, läsbart)

### Animationer
- Framer Motion för alla micro-interactions
- Spring physics (bouncy feel)
- Smooth hover states (y-translate, shadow)
- Card transitions: 200ms ease-out

---

## 🗃️ Databas-ändringar

### Nya tabeller
```sql
chefs (
  id, name, slug, avatar_url, cover_image_url,
  bio, style_tags[], source_url,
  follower_count, recipe_count, is_verified,
  created_at, updated_at
)
```

### Uppdaterade tabeller
```sql
recipes (
  + chef_id (FK to chefs)
  + chef_name
  + chef_avatar_url
  + video_url
  + video_thumbnail
  ~ steps: TEXT[] → JSONB (stöd för bilder, timers, duration)
)
```

### Demo-data
- 2 kockar (Catarina, Anette)
- 5 recept med fullständiga instruktioner
- Bilder från Unsplash

---

## 📦 Nya Komponenter

| Komponent | Beskrivning |
|-----------|-------------|
| `ChefCircle` | Kock-avatar med verified badge |
| `ChefCarousel` | Horisontell scroll med kockar |
| `RecipeCard` | Pinchos-style receptkort |
| `RecipeHero` | Hero-sektion för receptsidor |
| `SearchBar` | Sök med filter-chips och avancerade filter |

---

## 🚀 Deployment

**GitHub:** https://github.com/marcus-ai-bot/maltidsplaneraren
**Vercel:** Auto-deploy från master
**Supabase Project:** `ememxrbadnxcxnpqjetk`

### Migrations körda:
- ✅ `20260210104000_add_chefs.sql`
- ✅ Seed-script med demo-recept

---

## 🎯 Nästa Sprint

### Prioritet 1 (v2.1)
- [ ] Fungerande sök och filtrering (client-side först)
- [ ] "Lägg till i veckoplan" funktionalitet
- [ ] Rating-system (spara i DB)
- [ ] Favoriter

### Prioritet 2 (v2.2)
- [ ] Veckoplanering (swipe-interface)
- [ ] AI middagsförslag
- [ ] Inköpslista-generation

### Prioritet 3 (v2.3)
- [ ] Step-by-step Cooking Mode
- [ ] Hands-free mode med röstkommandon
- [ ] Video-stöd för recept

### Nice-to-have
- [ ] Community-kockar (användare kan bli kockar)
- [ ] Följ kockar
- [ ] Notiser vid nya recept
- [ ] Recipe import från URL

---

## 📸 Screenshots

**Startsida:** Hero + Chef Carousel + Navigation Cards
**Receptbank:** Search + Filters + Recipe Grid
**Receptsida:** Hero + 2-kolumns layout + Ingredient checkboxes
**Kock-profil:** Cover + Avatar + Bio + Recept

---

## 🐛 Kända Buggar

- [ ] Search är placeholder (inte implementerad ännu)
- [ ] "Lägg till i veckoplan" knapp gör inget än
- [ ] Rating-systemet sparar inte
- [ ] Filter påverkar inte receptlistan än

---

## 💡 Lärdomar

### Vad funkade bra
- Framer Motion för smooth animationer
- Tailwind v4 är snabbt och enkelt
- Supabase Management API för migrations
- Component-first approach
- Kitchen Stories som inspiration

### Vad kan förbättras
- Client-side state management (behövs för filter)
- Image optimization (Next.js Image + Cloudinary?)
- Loading states (skeleton screens)
- Error handling

---

*Skapad av Molt (subagent) på uppdrag av Marcus*
*Tid: 10:40-11:40, 2026-02-10*
