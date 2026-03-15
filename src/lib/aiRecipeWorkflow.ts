import { z } from "zod";
import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DAY_LABELS } from "@/data/constants";

const IngredientSelectionSchema = z.object({
  ingredients: z.array(z.string()).min(1),
});

const UnitsToBuySchema = z.coerce
  .number()
  .positive()
  .transform((value) => Number(Math.max(0.1, value).toFixed(2)));

const WeeklyPlanSchema = z.object({
  meals: z
    .array(
      z.object({
        day: z.number().int().min(0),
        mealType: z.enum(["breakfast", "lunch", "dinner"]),
        recipeName: z.string(),
        description: z.string(),
        servings: z.number().min(1),
        macrosPerServing: z.object({
          calories: z.number().min(0),
          protein_g: z.number().min(0),
          carbs_g: z.number().min(0),
          fat_g: z.number().min(0),
        }),
        steps: z.array(z.string()).min(1),
        ingredients: z
          .array(
            z.object({
              ingredientName: z.string(),
              unitsToBuy: UnitsToBuySchema,
              quantityNote: z.string(),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

const WorkflowRequestSchema = z.object({
  request: z
    .string()
    .trim()
    .min(3)
    .default("Create a practical weekly meal plan"),
  budget: z.coerce.number().finite().positive(),
  numDays: z.coerce.number().int().min(1).max(7).default(5),
  caloriePreference: z.enum(["low", "balanced", "high"]).default("balanced"),
  dietaryRestrictions: z.array(z.string()).catch([]),
  cuisines: z.array(z.string()).catch([]),
  preferences: z.array(z.string()).catch([]),
  maxDifficulty: z.enum(["very_easy", "medium"]).default("medium"),
  maxCookTimeMin: z.coerce.number().int().min(5).max(180).default(30),
});

type WorkflowRequest = z.infer<typeof WorkflowRequestSchema>;
type IngredientSelection = z.infer<typeof IngredientSelectionSchema>;
type WeeklyPlanDraft = z.infer<typeof WeeklyPlanSchema>;

type IngredientRecord = {
  name: string;
  price: number;
  unit: string;
  imageUrl: string | null;
};

function mustGetApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }
  return key;
}

function parseJsonResponse<T>(rawText: string, schema: z.ZodType<T>): T {
  const trimmed = rawText.trim();

  try {
    return schema.parse(JSON.parse(trimmed));
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Model did not return valid JSON");
    }
    const maybeJson = trimmed.slice(firstBrace, lastBrace + 1);
    return schema.parse(JSON.parse(maybeJson));
  }
}

function normalizePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
}

async function loadIngredients(): Promise<IngredientRecord[]> {
  const jsonPath = path.join(process.cwd(), "ingredients.json");
  const raw = await readFile(jsonPath, "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    return [];
  }

  const byName = new Map<string, IngredientRecord>();

  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;
    const name = typeof record["Product Name"] === "string" ? record["Product Name"].trim() : "";
    if (!name) continue;

    const salePrice = normalizePrice(record["Produce Sale Price"]);
    const basePrice = normalizePrice(record["Produce Price"]);
    const price = salePrice ?? basePrice;
    if (!price) continue;

    const unit = typeof record.CupMeasure === "string" ? record.CupMeasure : "1EA";
    const imageUrl =
      typeof record.smallImageFile === "string"
        ? record.smallImageFile
        : typeof record.SmallImageFile === "string"
          ? record.SmallImageFile
          : null;

    const existing = byName.get(name);
    if (!existing || price < existing.price) {
      byName.set(name, { name, price, unit, imageUrl });
    }
  }

  return Array.from(byName.values());
}

function buildWorkflowPrompt(input: WorkflowRequest): string {
  return [
    `User request: ${input.request || "Create a tasty weekly meal plan"}`,
    `Budget (AUD): ${input.budget}`,
    `Number of days: ${input.numDays}`,
    `Calorie preference: ${input.caloriePreference}`,
    `Preferred cuisines: ${input.cuisines.join(", ") || "none specified"}`,
    `Meal preferences: ${input.preferences.join(", ") || "none specified"}`,
    `Dietary restrictions: ${input.dietaryRestrictions.join(", ") || "none specified"}`,
    `Max difficulty: ${input.maxDifficulty}`,
    `Max cook time minutes: ${input.maxCookTimeMin}`,
  ].join("\n");
}

async function runIngredientAgent(
  client: OpenAI,
  workflowText: string,
  ingredients: IngredientRecord[]
): Promise<IngredientSelection> {
  const ingredientCatalog = ingredients
    .map((i) => `${i.name} | $${i.price.toFixed(2)} | unit ${i.unit}`)
    .join("\n");

  const response = await client.responses.create({
    model: process.env.OPENAI_WORKFLOW_MODEL || "gpt-5-mini",
    input: [
      {
        role: "system",
        content:
          "You are IngredientSelector. Return JSON only: {\"ingredients\": [string]}. Select practical ingredient names from the catalog to support a full week plan. Ignore budget in this step.",
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `${workflowText}\n\nAvailable ingredients catalog:\n${ingredientCatalog}`,
          },
        ],
      },
    ],
  });

  return parseJsonResponse(response.output_text, IngredientSelectionSchema);
}

async function runWeeklyPlanAgent(
  client: OpenAI,
  workflowText: string,
  numDays: number,
  budget: number,
  selectedIngredients: IngredientRecord[]
): Promise<WeeklyPlanDraft> {
  const ingredientLines = selectedIngredients
    .map((i) => `${i.name} | unit price $${i.price.toFixed(2)} | unit ${i.unit}`)
    .join("\n");

  const systemPrompt =
    "You are WeeklyMealPlanner. Return strict JSON only with shape { meals: [...] }. For each day from 0 to numDays-1, include breakfast, lunch, and dinner entries. Each meal item must include day, mealType, recipeName, description, servings, macrosPerServing, steps, ingredients. macrosPerServing must include calories, protein_g, carbs_g, fat_g (all numeric, per serving). Each ingredient must be { ingredientName, unitsToBuy, quantityNote }, and ingredientName must exactly match one provided ingredient. Keep the whole plan affordable within budget.";

  let lastDraft: WeeklyPlanDraft | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const retryHintText: string =
      attempt === 0 || !lastDraft
        ? ""
        : "\nPrevious attempt was over budget. Use cheaper ingredients and smaller unit counts while preserving variety.";

    const response = await client.responses.create({
      model: process.env.OPENAI_WORKFLOW_MODEL || "gpt-5-mini",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                `${workflowText}\nBudget cap: $${budget.toFixed(2)} AUD\nRequired days: ${numDays}\nMeal types per day: breakfast, lunch, dinner\n\nUse only these ingredients:\n${ingredientLines}${retryHintText}`,
            },
          ],
        },
      ],
    });

    const draft = parseJsonResponse(response.output_text, WeeklyPlanSchema);
    lastDraft = draft;

    const lookup = new Map(selectedIngredients.map((i) => [i.name, i]));
    const aggregateUnits = new Map<string, number>();
    for (const meal of draft.meals) {
      for (const item of meal.ingredients) {
        aggregateUnits.set(
          item.ingredientName,
          (aggregateUnits.get(item.ingredientName) ?? 0) + item.unitsToBuy
        );
      }
    }

    let total = 0;
    for (const [ingredientName, unitsToBuy] of aggregateUnits.entries()) {
      const ingredient = lookup.get(ingredientName);
      if (!ingredient) continue;
      total += ingredient.price * unitsToBuy;
    }

    if (total <= budget) {
      return draft;
    }
  }

  if (!lastDraft) {
    throw new Error("Recipe generation failed");
  }

  return lastDraft;
}

export async function runAiRecipeWorkflow(rawInput: unknown) {
  const input = WorkflowRequestSchema.parse(rawInput);
  const ingredients = await loadIngredients();

  if (ingredients.length === 0) {
    throw new Error("No valid ingredients found in ingredients.json");
  }

  const client = new OpenAI({ apiKey: mustGetApiKey() });
  const workflowText = buildWorkflowPrompt(input);

  const selectedByAgent = await runIngredientAgent(client, workflowText, ingredients);
  const selectedSet = new Set(selectedByAgent.ingredients.map((name) => name.trim()));

  const selectedIngredients = ingredients.filter((ingredient) => selectedSet.has(ingredient.name));
  const fallbackIngredients =
    selectedIngredients.length > 0 ? selectedIngredients : ingredients.slice(0, 80);

  const weeklyDraft = await runWeeklyPlanAgent(
    client,
    workflowText,
    input.numDays,
    input.budget,
    fallbackIngredients
  );
  const ingredientLookup = new Map(fallbackIngredients.map((i) => [i.name, i]));

  const mealEntries = weeklyDraft.meals
    .filter((meal) => meal.day >= 0 && meal.day < input.numDays)
    .map((meal, idx) => {
      const enrichedIngredients = meal.ingredients
        .map((item) => {
          const ingredient = ingredientLookup.get(item.ingredientName);
          if (!ingredient) return null;

          const itemCost = Number((ingredient.price * item.unitsToBuy).toFixed(2));
          return {
            ingredientName: item.ingredientName,
            quantity: item.quantityNote,
            unitsToBuy: item.unitsToBuy,
            unitPrice: ingredient.price,
            unit: ingredient.unit,
            itemCost,
            imageUrl: ingredient.imageUrl,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const mealCost = Number(
        enrichedIngredients.reduce((sum, ing) => sum + ing.itemCost, 0).toFixed(2)
      );

      return {
        id: `${meal.day}-${meal.mealType}-${idx}`,
        day: meal.day,
        dayLabel: DAY_LABELS[meal.day] ?? `Day ${meal.day + 1}`,
        mealType: meal.mealType,
        recipeName: meal.recipeName,
        description: meal.description,
        servings: Math.max(1, Math.round(meal.servings)),
        macrosPerServing: {
          calories: Number(meal.macrosPerServing.calories.toFixed(0)),
          protein_g: Number(meal.macrosPerServing.protein_g.toFixed(1)),
          carbs_g: Number(meal.macrosPerServing.carbs_g.toFixed(1)),
          fat_g: Number(meal.macrosPerServing.fat_g.toFixed(1)),
        },
        steps: meal.steps,
        ingredients: enrichedIngredients,
        mealCost,
      };
    });

  const aggregatedUnits = new Map<string, number>();
  for (const meal of mealEntries) {
    for (const ingredient of meal.ingredients) {
      aggregatedUnits.set(
        ingredient.ingredientName,
        (aggregatedUnits.get(ingredient.ingredientName) ?? 0) + ingredient.unitsToBuy
      );
    }
  }

  const shoppingItems = Array.from(aggregatedUnits.entries())
    .map(([ingredientName, unitsToBuy]) => {
      const ingredient = ingredientLookup.get(ingredientName);
      if (!ingredient) return null;
      const itemCost = Number((ingredient.price * unitsToBuy).toFixed(2));
      return {
        ingredientName,
        quantity: `${unitsToBuy.toFixed(2)} units total`,
        unitsToBuy,
        unitPrice: ingredient.price,
        itemCost,
        unit: ingredient.unit,
        imageUrl: ingredient.imageUrl,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const totalPrice = Number(
    shoppingItems.reduce((sum, item) => sum + item.itemCost, 0).toFixed(2)
  );

  const totalServings = mealEntries.reduce((sum, meal) => sum + meal.servings, 0);
  const normalizedServings = Math.max(1, totalServings);
  const pricePerServing = Number((totalPrice / normalizedServings).toFixed(2));

  return {
    request: input.request || "Weekly AI meal plan",
    summary: {
      budget: input.budget,
      numDays: input.numDays,
      totalMeals: mealEntries.length,
      budgetExceeded: totalPrice > input.budget,
      totalPrice,
      pricePerServing,
    },
    meals: mealEntries,
    costs: {
      totalPrice,
      pricePerServing,
      shoppingItems,
    },
  };
}
