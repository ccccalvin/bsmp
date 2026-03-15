"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MealSlot } from "@/lib/types";
import { DAILY_MACRO_TARGETS } from "@/data/constants";

interface DailyMacros {
  day: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

const MACRO_COLORS = {
  protein: "#3b82f6",
  carbs: "#f59e0b",
  fat: "#ef4444",
};

const MACRO_LABELS: Record<string, string> = {
  protein: "Protein",
  carbs: "Carbs",
  fat: "Fat",
};

interface NutritionChartProps {
  slots: MealSlot[];
}

export default function NutritionChart({ slots }: NutritionChartProps) {
  const [view, setView] = useState<"macros" | "calories">("macros");

  const dailyData = useMemo<DailyMacros[]>(() => {
    const dayMap = new Map<
      number,
      { label: string; protein: number; carbs: number; fat: number; calories: number }
    >();

    for (const slot of slots) {
      if (!dayMap.has(slot.day)) {
        dayMap.set(slot.day, {
          label: slot.day_label,
          protein: 0,
          carbs: 0,
          fat: 0,
          calories: 0,
        });
      }
      const entry = dayMap.get(slot.day)!;
      entry.protein += slot.recipe.protein_per_serving;
      entry.carbs += slot.recipe.carbs_per_serving;
      entry.fat += slot.recipe.fat_per_serving;
      entry.calories += slot.recipe.calories_per_serving;
    }

    return Array.from(dayMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([, d]) => ({
        day: d.label,
        protein: Math.round(d.protein * 10) / 10,
        carbs: Math.round(d.carbs * 10) / 10,
        fat: Math.round(d.fat * 10) / 10,
        calories: Math.round(d.calories),
      }));
  }, [slots]);

  if (slots.length === 0) return null;

  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Nutrition Summary</h3>
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          <button
            onClick={() => setView("macros")}
            className={`px-3 py-1.5 transition-colors ${
              view === "macros"
                ? "bg-primary text-white"
                : "hover:bg-secondary"
            }`}
          >
            Macros
          </button>
          <button
            onClick={() => setView("calories")}
            className={`px-3 py-1.5 transition-colors ${
              view === "calories"
                ? "bg-primary text-white"
                : "hover:bg-secondary"
            }`}
          >
            Calories
          </button>
        </div>
      </div>

      {view === "macros" ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dailyData}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `${v}g`}
            />
            <Tooltip
              formatter={(value, name) => [
                `${Number(value)}g`,
                MACRO_LABELS[String(name)] || name,
              ]}
            />
            <Legend
              formatter={(value: string) => MACRO_LABELS[value] || value}
            />
            <ReferenceLine
              y={DAILY_MACRO_TARGETS.protein}
              stroke={MACRO_COLORS.protein}
              strokeDasharray="6 4"
              strokeOpacity={0.6}
            />
            <ReferenceLine
              y={DAILY_MACRO_TARGETS.fat}
              stroke={MACRO_COLORS.fat}
              strokeDasharray="6 4"
              strokeOpacity={0.6}
            />
            <Bar dataKey="protein" stackId="macros" fill={MACRO_COLORS.protein} />
            <Bar dataKey="carbs" stackId="macros" fill={MACRO_COLORS.carbs} />
            <Bar dataKey="fat" stackId="macros" fill={MACRO_COLORS.fat} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dailyData}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value)} kcal`, "Calories"]}
            />
            <Legend formatter={() => "Calories"} />
            <ReferenceLine
              y={DAILY_MACRO_TARGETS.calories}
              stroke="#16a34a"
              strokeDasharray="6 4"
              label={{ value: "Target", position: "right", fontSize: 11 }}
            />
            <Bar dataKey="calories" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}
