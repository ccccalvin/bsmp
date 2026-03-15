"use client";

import { Fragment } from "react";
import { MealSlot, MealType, CostDisplayMode } from "@/lib/types";
import { MEAL_TYPE_LABELS } from "@/data/constants";
import MealCard from "./MealCard";

interface CalendarGridProps {
  slots: MealSlot[];
  numDays: number;
  costMode: CostDisplayMode;
  onSwap: (day: number, mealType: MealType) => void;
  onMealClick: (slot: MealSlot) => void;
}

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export default function CalendarGrid({
  slots,
  numDays,
  costMode,
  onSwap,
  onMealClick,
}: CalendarGridProps) {
  // Get unique day labels
  const dayLabels = Array.from(
    new Set(slots.map((s) => s.day_label))
  ).slice(0, numDays);

  const getSlot = (day: number, mealType: MealType) =>
    slots.find((s) => s.day === day && s.meal_type === mealType);

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-3 min-w-[600px]"
        style={{
          gridTemplateColumns: `80px repeat(${numDays}, 1fr)`,
        }}
      >
        {/* Header row */}
        <div />
        {dayLabels.map((label, i) => (
          <div
            key={i}
            className="text-center text-sm font-semibold py-2 text-muted"
          >
            {label}
          </div>
        ))}

        {/* Meal rows */}
        {MEAL_TYPES.map((mealType) => (
          <Fragment key={mealType}>
            <div
              className="flex items-center text-sm font-medium text-muted"
            >
              {MEAL_TYPE_LABELS[mealType]}
            </div>
            {Array.from({ length: numDays }, (_, day) => {
              const slot = getSlot(day, mealType);
              return slot ? (
                <MealCard
                  key={`${day}-${mealType}`}
                  slot={slot}
                  costMode={costMode}
                  onSwap={() => onSwap(day, mealType)}
                  onClick={() => onMealClick(slot)}
                />
              ) : (
                <div
                  key={`${day}-${mealType}`}
                  className="border border-dashed border-border rounded-xl p-3 flex items-center justify-center text-xs text-muted"
                >
                  No meal
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
