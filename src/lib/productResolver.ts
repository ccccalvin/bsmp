import { productAliases } from "@/data/productAliases";

/**
 * Resolves a recipe-friendly product ID to an array of slugified IDs
 * from the ingredients dataset. Falls back to [productId] if no alias exists.
 */
export function resolveProductIds(productId: string): string[] {
  const aliases = productAliases[productId];
  if (aliases && aliases.length > 0) return aliases;
  return [productId];
}
