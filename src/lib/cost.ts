import { Recipe, Product, RecipeCost, CostItem } from "./types";
import { resolveProductIds } from "./productResolver";

export function findCheapestProduct(
  productId: string,
  products: Product[]
): Product | null {
  const ids = resolveProductIds(productId);
  const matches = products.filter((p) => ids.includes(p.id));
  if (matches.length === 0) return null;
  return matches.reduce((a, b) =>
    a.price_per_100g < b.price_per_100g ? a : b
  );
}

export function calcRecipeCost(
  recipe: Recipe,
  products: Product[]
): RecipeCost {
  const items: CostItem[] = [];

  for (const ingredient of recipe.ingredients) {
    const cheapest = findCheapestProduct(ingredient.product_id, products);
    if (!cheapest) continue;

    const packsNeeded = Math.ceil(ingredient.quantity_g / cheapest.weight_g);
    const totalCost = packsNeeded * cheapest.price;
    const consumedCost =
      (ingredient.quantity_g / cheapest.weight_g) * cheapest.price;

    items.push({
      product: cheapest,
      quantity_needed_g: ingredient.quantity_g,
      packs_to_buy: packsNeeded,
      total_cost: totalCost,
      consumed_cost: consumedCost,
    });
  }

  const shoppingTotal = items.reduce((sum, i) => sum + i.total_cost, 0);
  const consumedTotal = items.reduce((sum, i) => sum + i.consumed_cost, 0);

  return {
    per_serving: consumedTotal / recipe.servings,
    shopping_total: shoppingTotal,
    items,
  };
}
