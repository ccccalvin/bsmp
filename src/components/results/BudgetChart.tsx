"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MealSlot, ShoppingList, ProductCategory } from "@/lib/types";
import { products as allProducts } from "@/data/productsFromIngredients";
import { resolveProductIds } from "@/lib/productResolver";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  protein: "Protein",
  carbs: "Carbs",
  vegetables: "Vegetables",
  dairy: "Dairy",
  pantry: "Pantry",
  spices_sauces: "Spices & Sauces",
};

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  protein: "#ef4444",
  carbs: "#f59e0b",
  vegetables: "#22c55e",
  dairy: "#3b82f6",
  pantry: "#a855f7",
  spices_sauces: "#ec4899",
};

const ALL_CATEGORIES: ProductCategory[] = [
  "protein",
  "carbs",
  "vegetables",
  "dairy",
  "pantry",
  "spices_sauces",
];

interface BudgetChartProps {
  shoppingList: ShoppingList;
  slots: MealSlot[];
}

export default function BudgetChart({ shoppingList, slots }: BudgetChartProps) {
  const [view, setView] = useState<"category" | "daily">("category");

  // Donut chart data: spending by product category
  const categoryData = useMemo(() => {
    const allItems = [...shoppingList.woolworths, ...shoppingList.coles];
    const byCategory = new Map<ProductCategory, number>();

    for (const item of allItems) {
      const cat = item.product.category;
      byCategory.set(cat, (byCategory.get(cat) || 0) + item.total_cost);
    }

    return ALL_CATEGORIES
      .filter((cat) => byCategory.has(cat))
      .map((cat) => ({
        name: CATEGORY_LABELS[cat],
        value: Math.round((byCategory.get(cat) || 0) * 100) / 100,
        color: CATEGORY_COLORS[cat],
      }));
  }, [shoppingList]);

  // Stacked bar chart data: cost per day by category
  const dailyData = useMemo(() => {
    // Build a product_id -> category map
    const productCategoryMap = new Map<string, ProductCategory>();
    for (const p of allProducts) {
      productCategoryMap.set(p.id, p.category);
    }

    // Build a product_id -> cheapest price_per_g map
    const cheapestPricePerG = new Map<string, number>();
    for (const p of allProducts) {
      const ppg = p.price / p.weight_g;
      const existing = cheapestPricePerG.get(p.id);
      if (!existing || ppg < existing) {
        cheapestPricePerG.set(p.id, ppg);
      }
    }

    // Group slots by day
    const dayMap = new Map<number, { label: string; costs: Record<string, number> }>();

    for (const slot of slots) {
      if (!dayMap.has(slot.day)) {
        dayMap.set(slot.day, {
          label: slot.day_label,
          costs: {},
        });
      }
      const entry = dayMap.get(slot.day)!;

      for (const ing of slot.recipe.ingredients) {
        const resolvedIds = resolveProductIds(ing.product_id);
        const cat = resolvedIds.reduce<ProductCategory | null>((found, id) => found ?? productCategoryMap.get(id) ?? null, null) ?? "pantry";
        const pricePerG = resolvedIds.reduce<number>((best, id) => {
          const p = cheapestPricePerG.get(id);
          return p !== undefined && p < best ? p : best;
        }, Infinity);
        const effectivePricePerG = pricePerG === Infinity ? 0 : pricePerG;
        const servingQty = ing.quantity_g / slot.recipe.servings;
        const cost = servingQty * effectivePricePerG;
        entry.costs[cat] = (entry.costs[cat] || 0) + cost;
      }
    }

    return Array.from(dayMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([, { label, costs }]) => {
        const row: Record<string, string | number> = { day: label };
        for (const cat of ALL_CATEGORIES) {
          row[cat] = Math.round((costs[cat] || 0) * 100) / 100;
        }
        return row;
      });
  }, [slots]);

  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Budget Breakdown</h3>
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          <button
            onClick={() => setView("category")}
            className={`px-3 py-1.5 transition-colors ${
              view === "category"
                ? "bg-primary text-white"
                : "hover:bg-secondary"
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setView("daily")}
            className={`px-3 py-1.5 transition-colors ${
              view === "daily"
                ? "bg-primary text-white"
                : "hover:bg-secondary"
            }`}
          >
            By Day
          </button>
        </div>
      </div>

      {view === "category" ? (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name} $${value.toFixed(2)}`}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value).toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:flex-col">
            {categoryData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted">{entry.name}</span>
                <span className="font-medium">${entry.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dailyData}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              formatter={(value, name) => [
                `$${Number(value).toFixed(2)}`,
                CATEGORY_LABELS[String(name) as ProductCategory] || name,
              ]}
            />
            <Legend
              formatter={(value: string) =>
                CATEGORY_LABELS[value as ProductCategory] || value
              }
            />
            {ALL_CATEGORIES.map((cat) => (
              <Bar
                key={cat}
                dataKey={cat}
                stackId="cost"
                fill={CATEGORY_COLORS[cat]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
