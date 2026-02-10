export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Helper types
export interface Chef {
  id: string
  name: string
  slug: string
  bio: string | null
  image_url: string | null
  avatar_url: string | null
  website_url: string | null
  specialty: string | null
  is_verified: boolean
  recipe_count?: number
  created_at: string
}

// Base recipe from DB
export type RecipeRow = Database['public']['Tables']['recipes']['Row']

// Extended recipe with optional chef join
export interface Recipe extends RecipeRow {
  chef_id?: string | null
  chef_name?: string | null
  chef_avatar_url?: string | null
}

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          household_id: string | null
          role: string
          dietary_restrictions: string[] | null
          skill_level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          household_id?: string | null
          role?: string
          dietary_restrictions?: string[] | null
          skill_level?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          household_id?: string | null
          role?: string
          dietary_restrictions?: string[] | null
          skill_level?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          source_url: string | null
          source_name: string | null
          category: string | null
          tags: string[] | null
          difficulty: string
          prep_time_minutes: number | null
          cook_time_minutes: number | null
          ingredients: Json | null
          steps: string[] | null
          servings: number
          suitable_for_lunch_box: boolean
          is_light_meal: boolean
          is_fancy: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          source_url?: string | null
          source_name?: string | null
          category?: string | null
          tags?: string[] | null
          difficulty?: string
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          ingredients?: Json | null
          steps?: string[] | null
          servings?: number
          suitable_for_lunch_box?: boolean
          is_light_meal?: boolean
          is_fancy?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          source_url?: string | null
          source_name?: string | null
          category?: string | null
          tags?: string[] | null
          difficulty?: string
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          ingredients?: Json | null
          steps?: string[] | null
          servings?: number
          suitable_for_lunch_box?: boolean
          is_light_meal?: boolean
          is_fancy?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      day_plans: {
        Row: {
          id: string
          user_id: string
          household_id: string
          date: string
          eating_status: string | null
          time_availability: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          household_id: string
          date: string
          eating_status?: string | null
          time_availability?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          household_id?: string
          date?: string
          eating_status?: string | null
          time_availability?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_suggestions: {
        Row: {
          id: string
          household_id: string
          date: string
          recipe_id: string
          meal_type: string
          status: string
          reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          date: string
          recipe_id: string
          meal_type?: string
          status?: string
          reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          date?: string
          recipe_id?: string
          meal_type?: string
          status?: string
          reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipe_ratings: {
        Row: {
          user_id: string
          recipe_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          recipe_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          recipe_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}
