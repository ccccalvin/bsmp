# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build (also runs TypeScript checking)
- `npm run lint` — ESLint
- No test runner is configured

## Architecture

Next.js 16 App Router with TypeScript and Tailwind CSS 4. All computation runs client-side — no backend API, no database. Product/recipe data is hardcoded in `src/data/`.

### Data Flow

1. **Landing** (`/`) → links to wizard
2. **Wizard** (`/wizard`) — 3-step client form collects `UserPreferences` (budget, diet, cuisine, difficulty)
3. On "Generate", preferences are **base64-encoded into the URL** (`/results?prefs=<base64>`)
4. **Results** (`/results`) — decodes prefs, runs the algorithm client-side via `useMealPlan` hook, renders calendar grid + shopping sidebar

### Algorithm Pipeline (`src/lib/`)

`planner.ts::generateMealPlan` orchestrates the full flow:

1. **Filter** (`scoring.ts::filterRecipes`) — hard-filters by dietary restrictions and difficulty
2. **Cost** (`cost.ts::calcRecipeCost`) — maps each recipe ingredient to cheapest product across stores; computes both `shopping_total` (whole packs) and `per_serving` (prorated consumption)
3. **Score** (`scoring.ts::scoreRecipe`) — weighted composite: affordability 40%, nutrition 25%, cuisine 20%, ease 15%
4. **Fill slots** — greedy assignment of top-scored recipes into day × meal_type grid, with consecutive-day variety check
5. **Shopping list** (`shopping.ts::buildShoppingList`) — aggregates 1-serving quantities across all slots, rounds up to purchasable packs, splits by cheapest store

### Product-Recipe Linking

`Product.id` is a match key (e.g., `"chicken_breast"`). Multiple products share the same `id` (one per store). `RecipeIngredient.product_id` references this key. Cost calculation finds the cheapest across stores.

### Cost Duality

Two cost views toggled in the UI:
- **Shopping total** — real checkout cost (whole packs, rounded up)
- **Per serving** — theoretical consumption cost (prorated by weight used)

Shopping total is always >= per-serving total because you buy whole packs.

### Swap Mechanic

`planner.ts::swapMealInPlan` finds the next-highest-scored recipe for the same meal_type that isn't already in the plan, replaces the slot, and recomputes the shopping list.
