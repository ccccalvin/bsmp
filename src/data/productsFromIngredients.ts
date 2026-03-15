import rawIngredients from "../../ingredients.json";
import { Product, ProductCategory } from "@/lib/types";

type RawIngredient = {
  "Product Name"?: unknown;
  "Produce Price"?: unknown;
  "Produce Sale Price"?: unknown;
  CupMeasure?: unknown;
  CupString?: unknown;
  SmallImageFile?: unknown;
  smallImageFile?: unknown;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function inferCategory(name: string): ProductCategory {
  const n = name.toLowerCase();

  if (/(chicken|beef|mince|egg|tofu|tuna|lentil|chickpea)/.test(n)) {
    return "protein";
  }
  if (/(rice|pasta|bread|oat|noodle|potato|banana)/.test(n)) {
    return "carbs";
  }
  if (/(tomato|onion|garlic|spinach|capsicum|carrot|cucumber|broccoli|avocado|apple|nectarine|strawberr|vegetable)/.test(n)) {
    return "vegetables";
  }
  if (/(milk|yogurt|cheese|butter)/.test(n)) {
    return "dairy";
  }
  if (/(oil|sugar|flour|honey|coconut)/.test(n)) {
    return "pantry";
  }
  return "spices_sauces";
}

function parseWeightGrams(cupMeasure: unknown): number {
  if (typeof cupMeasure !== "string") return 100;

  const measure = cupMeasure.trim().toUpperCase();
  const match = measure.match(/([0-9]+(?:\.[0-9]+)?)\s*(KG|G)/);
  if (!match) return 100;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return 100;

  return match[2] === "KG" ? amount * 1000 : amount;
}

function normalizeIngredient(raw: RawIngredient): Product | null {
  const name = typeof raw["Product Name"] === "string" ? raw["Product Name"].trim() : "";
  if (!name) return null;

  const salePrice = toNumber(raw["Produce Sale Price"]);
  const basePrice = toNumber(raw["Produce Price"]);
  const price = salePrice ?? basePrice;
  if (price === null || price <= 0) return null;

  const weight_g = parseWeightGrams(raw.CupMeasure);
  const price_per_100g = Number(((price / weight_g) * 100).toFixed(2));

  return {
    id: slugifyName(name),
    name,
    store: "woolworths",
    price,
    weight_g,
    price_per_100g,
    category: inferCategory(name),
  };
}

const normalized = (Array.isArray(rawIngredients) ? rawIngredients : [])
  .map((item) => normalizeIngredient(item as RawIngredient))
  .filter((item): item is Product => item !== null);

const seen = new Set<string>();
export const products: Product[] = normalized.filter((item) => {
  const key = `${item.id}|${item.store}|${item.price}|${item.weight_g}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
