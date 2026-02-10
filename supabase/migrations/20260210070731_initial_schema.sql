-- Måltidsplaneraren Initial Schema
-- Created: 2026-02-10

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Households table (for SaaS multi-tenancy)
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  household_id UUID REFERENCES households ON DELETE SET NULL,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  dietary_restrictions TEXT[],
  skill_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recipes
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source_url TEXT,
  source_name TEXT, -- "Catarina König", "56kilo", etc.
  
  -- Categorization
  category TEXT, -- 'förrätt', 'varmrätt', 'dessert', 'drink'
  tags TEXT[], -- ["low-carb", "vegetariskt", "snabb", "festlig"]
  difficulty TEXT DEFAULT 'medel', -- 'enkel', 'medel', 'avancerad'
  prep_time_minutes INT,
  cook_time_minutes INT,
  
  -- Recipe content
  ingredients JSONB, -- [{name, amount, unit}]
  steps TEXT[],
  servings INT DEFAULT 4,
  
  -- Flags
  suitable_for_lunch_box BOOLEAN DEFAULT false,
  is_light_meal BOOLEAN DEFAULT false,
  is_fancy BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for recipes
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);

-- Day plans (user scheduling)
CREATE TABLE day_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  household_id UUID REFERENCES households ON DELETE CASCADE,
  date DATE NOT NULL,
  eating_status TEXT, -- 'home', 'out', 'lunch_box', 'light'
  time_availability TEXT, -- 'early', 'late'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_day_plans_user_date ON day_plans(user_id, date);
CREATE INDEX idx_day_plans_household_date ON day_plans(household_id, date);

-- Meal suggestions (what AI suggests)
CREATE TABLE meal_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households ON DELETE CASCADE,
  date DATE NOT NULL,
  recipe_id UUID REFERENCES recipes ON DELETE CASCADE,
  meal_type TEXT DEFAULT 'dinner', -- 'dinner', 'starter', 'dessert'
  status TEXT DEFAULT 'suggested', -- 'suggested', 'accepted', 'replaced', 'cooked'
  reason TEXT, -- AI explanation for why this recipe
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_meal_suggestions_household_date ON meal_suggestions(household_id, date);
CREATE INDEX idx_meal_suggestions_status ON meal_suggestions(status);

-- Recipe ratings
CREATE TABLE recipe_ratings (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

CREATE INDEX idx_recipe_ratings_recipe ON recipe_ratings(recipe_id);

-- Recipe swipes (for AI learning)
CREATE TABLE recipe_swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes ON DELETE CASCADE,
  direction TEXT NOT NULL, -- 'left', 'right'
  context TEXT, -- 'discovery', 'replacement', 'weekly'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_recipe_swipes_user ON recipe_swipes(user_id);
CREATE INDEX idx_recipe_swipes_recipe ON recipe_swipes(recipe_id);

-- Shopping list items
CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households ON DELETE CASCADE,
  ingredient TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  status TEXT DEFAULT 'to_buy', -- 'to_buy', 'have_at_home', 'bought'
  source_recipe_id UUID REFERENCES recipes ON DELETE SET NULL,
  source_meal_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shopping_items_household ON shopping_items(household_id);
CREATE INDEX idx_shopping_items_status ON shopping_items(status);

-- Pantry snapshots (future: image analysis)
CREATE TABLE pantry_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households ON DELETE CASCADE,
  image_url TEXT,
  detected_items TEXT[],
  analyzed_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_snapshots ENABLE ROW LEVEL SECURITY;

-- Recipes are public (everyone can read)
CREATE POLICY "Recipes are viewable by everyone" ON recipes
  FOR SELECT USING (true);

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Household members can view household data
CREATE POLICY "Household members can view household" ON households
  FOR SELECT USING (
    id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

-- Day plans: users can manage their own
CREATE POLICY "Users can manage own day plans" ON day_plans
  FOR ALL USING (user_id = auth.uid());

-- Meal suggestions: household members can view
CREATE POLICY "Household members can view meal suggestions" ON meal_suggestions
  FOR SELECT USING (
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

-- Recipe ratings: users can manage their own
CREATE POLICY "Users can manage own ratings" ON recipe_ratings
  FOR ALL USING (user_id = auth.uid());

-- Recipe swipes: users can manage their own
CREATE POLICY "Users can manage own swipes" ON recipe_swipes
  FOR ALL USING (user_id = auth.uid());

-- Shopping items: household members can manage
CREATE POLICY "Household members can manage shopping items" ON shopping_items
  FOR ALL USING (
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

-- Pantry snapshots: household members can view
CREATE POLICY "Household members can view pantry snapshots" ON pantry_snapshots
  FOR SELECT USING (
    household_id IN (SELECT household_id FROM user_profiles WHERE id = auth.uid())
  );

-- Functions for automatic household creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Helper function to get recipe average rating
CREATE OR REPLACE FUNCTION get_recipe_avg_rating(recipe_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(AVG(rating), 0) FROM recipe_ratings WHERE recipe_id = recipe_uuid;
$$ LANGUAGE sql STABLE;

-- Helper function to get recipe swipe score
CREATE OR REPLACE FUNCTION get_recipe_swipe_score(recipe_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT 
    COALESCE(
      (COUNT(*) FILTER (WHERE direction = 'right')::NUMERIC / NULLIF(COUNT(*), 0)),
      0
    )
  FROM recipe_swipes 
  WHERE recipe_id = recipe_uuid;
$$ LANGUAGE sql STABLE;
