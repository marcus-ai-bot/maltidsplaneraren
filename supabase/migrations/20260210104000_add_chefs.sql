-- Chef Profiles Table
CREATE TABLE IF NOT EXISTS chefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  cover_image_url TEXT,
  bio TEXT,
  style_tags TEXT[] DEFAULT '{}',
  source_url TEXT,
  follower_count INTEGER DEFAULT 0,
  recipe_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add chef reference to recipes
ALTER TABLE recipes
ADD COLUMN chef_id UUID REFERENCES chefs(id) ON DELETE SET NULL,
ADD COLUMN chef_name TEXT,
ADD COLUMN chef_avatar_url TEXT;

-- Update recipes.steps to support rich step data
-- We'll keep steps as JSONB for flexibility
ALTER TABLE recipes
ALTER COLUMN steps TYPE JSONB USING to_jsonb(steps);

-- Add video support
ALTER TABLE recipes
ADD COLUMN video_url TEXT,
ADD COLUMN video_thumbnail TEXT;

-- Index for chef lookup
CREATE INDEX idx_recipes_chef_id ON recipes(chef_id);
CREATE INDEX idx_chefs_slug ON chefs(slug);

-- Insert demo chefs
INSERT INTO chefs (name, slug, bio, style_tags, is_verified, avatar_url, cover_image_url) VALUES
(
  'Catarina König',
  'catarina-konig',
  'Matglad nordisk kock med passion för säsongsbaserad och enkel vardagsmat. Delar recept från mitt kök i Stockholm.',
  ARRAY['Nordiskt', 'Enkelt', 'Vardagsmat', 'Säsongsbaserat'],
  true,
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop'
),
(
  '56kilo by Anette',
  '56kilo',
  'Low-carb livsstil och LCHF-recept som faktiskt smakar. Bevisar att nyttig mat inte behöver vara tråkig!',
  ARRAY['Low-carb', 'LCHF', 'Hälsosamt', 'Proteinrikt'],
  true,
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=400&fit=crop'
);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chefs_updated_at
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
