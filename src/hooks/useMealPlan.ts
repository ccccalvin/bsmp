"use client";

import { useState, useMemo, useCallback } from "react";
import {
  UserPreferences,
  MealPlan,
  MealType,
  ScoredRecipe,
  ShoppingList,
  CostDisplayMode,
} from "@/lib/types";
import { generateMealPlan, swapMealInPlan } from "@/lib/planner";
import { scoreAllRecipes } from "@/lib/scoring";
import { buildShoppingList } from "@/lib/shopping";
import { products } from "@/data/products";
import { recipes } from "@/data/recipes";

export function useMealPlan(prefs: UserPreferences) {
  const scoredRecipes = useMemo(
    () => scoreAllRecipes(recipes, prefs, products),
    [prefs]
  );

  const [plan, setPlan] = useState<MealPlan>(() =>
    generateMealPlan(prefs, recipes, products)
  );

  const [costMode, setCostMode] = useState<CostDisplayMode>("shopping_total");

  const shoppingList = useMemo<ShoppingList>(
    () => buildShoppingList(plan.slots, products),
    [plan.slots]
  );

  const swapMeal = useCallback(
    (day: number, mealType: MealType) => {
      setPlan((current) =>
        swapMealInPlan(current, day, mealType, scoredRecipes, products)
      );
    },
    [scoredRecipes]
  );

  const regenerate = useCallback(() => {
    setPlan(generateMealPlan(prefs, recipes, products));
  }, [prefs]);

  return {
    plan,
    shoppingList,
    costMode,
    setCostMode,
    swapMeal,
    regenerate,
    scoredRecipes,
  };
}
