// ---- Store & Product ----

export type Store = "woolworths" | "coles";

export type ProductCategory =
  | "protein"
  | "carbs"
  | "vegetables"
  | "dairy"
  | "pantry"
  | "spices_sauces";

export interface Product {
  id: string; // match_key, e.g. "chicken_breast"
  name: string;
  store: Store;
  price: number; // AUD, shelf price for the pack
  weight_g: number;
  price_per_100g: number;
  category: ProductCategory;
}

// ---- Recipe ----

export type Cuisine = "asian" | "western" | "indian" | "mediterranean";
export type Difficulty = "very_easy" | "medium";
export type MealType = "breakfast" | "lunch" | "dinner";
export type RecipeTag =
  | "high_protein"
  | "low_calorie"
  | "cheap"
  | "vegetarian"
  | "one_pan"
  | "meal_prep"
  | "no_dairy";

export interface RecipeIngredient {
  product_id: string; // match_key linking to Product.id
  name: string;
  quantity_g: number; // grams needed for the full recipe (all servings)
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: Cuisine;
  meal_types: MealType[];
  servings: number;
  ingredients: RecipeIngredient[];
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  difficulty: Difficulty;
  cook_time_min: number;
  tags: RecipeTag[];
  instructions: string[];
}

// ---- User Preferences ----

export type CaloriePreference = "low" | "balanced" | "high";

export type DietaryRestriction =
  | "vegetarian"
  | "halal"
  | "no_dairy"
  | "high_protein";

export interface UserPreferences {
  budget_weekly: number;
  num_days: number; // 1-7
  calorie_preference: CaloriePreference;
  dietary_restrictions: DietaryRestriction[];
  cuisines: Cuisine[];
  max_difficulty: Difficulty;
  max_cook_time_min: number;
}

// ---- Scoring ----

export interface ScoreWeights {
  affordability: number;
  nutrition: number;
  cuisine: number;
  ease: number;
}

export interface RecipeCost {
  per_serving: number;
  shopping_total: number;
  items: CostItem[];
}

export interface CostItem {
  product: Product;
  quantity_needed_g: number;
  packs_to_buy: number;
  total_cost: number;
  consumed_cost: number;
}

export interface ScoredRecipe {
  recipe: Recipe;
  cost: RecipeCost;
  total_score: number;
  affordability_score: number;
  nutrition_score: number;
  cuisine_score: number;
  ease_score: number;
}

// ---- Meal Plan ----

export interface MealSlot {
  day: number;
  day_label: string;
  meal_type: MealType;
  recipe: Recipe;
  cost_per_serving: number;
  shopping_cost: number;
}

export interface MealPlan {
  slots: MealSlot[];
  total_shopping_cost: number;
  total_per_serving_cost: number;
  budget: number;
  over_budget: boolean;
  warning?: string;
}

// ---- Shopping List ----

export interface ShoppingItem {
  product: Product;
  quantity_needed_g: number;
  packs_to_buy: number;
  total_cost: number;
}

export interface ShoppingList {
  woolworths: ShoppingItem[];
  coles: ShoppingItem[];
  total: number;
}

// ---- UI State ----

export type CostDisplayMode = "shopping_total" | "per_serving";
