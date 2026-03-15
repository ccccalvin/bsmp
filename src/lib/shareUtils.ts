import { ShoppingList, ShoppingItem } from "@/lib/types";

interface ListItem {
  name: string;
  detail: string;
  store: string;
}

function itemToListItem(item: ShoppingItem): ListItem {
  return {
    name: item.product.name,
    detail: `x${item.packs_to_buy} · ${item.quantity_needed_g}g · $${item.total_cost.toFixed(2)}`,
    store: item.product.store,
  };
}

export function buildShoppingListUrl(
  shoppingList: ShoppingList,
  origin: string
): string {
  const items: ListItem[] = [
    ...shoppingList.woolworths.map(itemToListItem),
    ...shoppingList.coles.map(itemToListItem),
  ];
  const encoded = btoa(JSON.stringify(items));
  return `${origin}/list?items=${encoded}`;
}

function formatItems(items: ShoppingItem[]): string {
  return items
    .map(
      (item) =>
        `- ${item.product.name} x${item.packs_to_buy} (${item.quantity_needed_g}g) — $${item.total_cost.toFixed(2)}`
    )
    .join("\n");
}

export function formatShoppingListText(shoppingList: ShoppingList): string {
  const sections: string[] = ["Shopping List - BudgetBite"];

  if (shoppingList.woolworths.length > 0) {
    sections.push(`WOOLWORTHS\n${formatItems(shoppingList.woolworths)}`);
  }

  if (shoppingList.coles.length > 0) {
    sections.push(`COLES\n${formatItems(shoppingList.coles)}`);
  }

  sections.push(`Total: $${shoppingList.total.toFixed(2)}`);

  return sections.join("\n\n");
}
