import { ScoreWeights } from "@/lib/types";

export const DEFAULT_WEIGHTS: ScoreWeights = {
  affordability: 0.4,
  nutrition: 0.25,
  cuisine: 0.2,
  ease: 0.15,
};

export const CALORIE_TARGETS = {
  low: { min: 300, max: 500 },
  balanced: { min: 450, max: 650 },
  high: { min: 600, max: 900 },
} as const;

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MEAL_TYPE_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
} as const;

export const CUISINE_LABELS = {
  asian: "Asian",
  western: "Western",
  indian: "Indian",
  mediterranean: "Mediterranean",
} as const;

export const DIFFICULTY_LABELS = {
  very_easy: "Very Easy",
  medium: "Medium",
} as const;
