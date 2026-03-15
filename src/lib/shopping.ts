import { MealSlot, Product, ShoppingItem, ShoppingList } from "./types";
import { resolveProductIds } from "./productResolver";

export function buildShoppingList(
  slots: MealSlot[],
  products: Product[]
): ShoppingList {
  // Aggregate ingredient needs across all meal slots
  const needed = new Map<string, number>();

  for (const slot of slots) {
    for (const ingredient of slot.recipe.ingredients) {
      // Each slot uses 1 serving worth of ingredients
      const qtyForSlot = ingredient.quantity_g / slot.recipe.servings;
      const current = needed.get(ingredient.product_id) || 0;
      needed.set(ingredient.product_id, current + qtyForSlot);
    }
  }

  const woolworthsItems: ShoppingItem[] = [];
  const colesItems: ShoppingItem[] = [];

  for (const [matchKey, quantityNeeded] of needed) {
    const ids = resolveProductIds(matchKey);
    const matching = products.filter((p) => ids.includes(p.id));
    if (matching.length === 0) continue;

    // Find cheapest option per store
    const byStore = new Map<string, Product>();
    for (const p of matching) {
      const existing = byStore.get(p.store);
      if (!existing || p.price_per_100g < existing.price_per_100g) {
        byStore.set(p.store, p);
      }
    }

    // Pick the store with lower total cost for this item
    let bestProduct: Product | null = null;
    let bestTotalCost = Infinity;

    for (const [, product] of byStore) {
      const packs = Math.ceil(quantityNeeded / product.weight_g);
      const totalCost = packs * product.price;
      if (totalCost < bestTotalCost) {
        bestTotalCost = totalCost;
        bestProduct = product;
      }
    }

    if (!bestProduct) continue;

    const packs = Math.ceil(quantityNeeded / bestProduct.weight_g);
    const item: ShoppingItem = {
      product: bestProduct,
      quantity_needed_g: Math.round(quantityNeeded),
      packs_to_buy: packs,
      total_cost: packs * bestProduct.price,
    };

    if (bestProduct.store === "woolworths") {
      woolworthsItems.push(item);
    } else {
      colesItems.push(item);
    }
  }

  const total = [...woolworthsItems, ...colesItems].reduce(
    (sum, i) => sum + i.total_cost,
    0
  );

  return {
    woolworths: woolworthsItems,
    coles: colesItems,
    total,
  };
}
