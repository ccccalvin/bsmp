"use client";

import { ShoppingList } from "@/lib/types";

interface ShoppingSidebarProps {
  shoppingList: ShoppingList;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ShoppingSidebar({
  shoppingList,
  isOpen,
  onToggle,
}: ShoppingSidebarProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 -translate-y-1/2 z-30 bg-primary text-white px-2 py-4 rounded-l-lg shadow-lg transition-all text-xs font-medium ${
          isOpen ? "right-80" : "right-0"
        }`}
        style={{ writingMode: "vertical-lr" }}
      >
        Shopping List
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-xl z-20 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold">Shopping List</h2>
          <p className="text-sm text-muted mt-1">
            Grouped by store for easy shopping
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Woolworths */}
          {shoppingList.woolworths.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-700 mb-2">
                Woolworths
              </h3>
              <div className="space-y-2">
                {shoppingList.woolworths.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-xs text-muted">
                        {item.packs_to_buy}x &middot; {item.quantity_needed_g}g
                        needed
                      </div>
                    </div>
                    <span className="font-medium">
                      ${item.total_cost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coles */}
          {shoppingList.coles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-2">
                Coles
              </h3>
              <div className="space-y-2">
                {shoppingList.coles.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-xs text-muted">
                        {item.packs_to_buy}x &middot; {item.quantity_needed_g}g
                        needed
                      </div>
                    </div>
                    <span className="font-medium">
                      ${item.total_cost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="p-4 border-t border-border bg-secondary">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">
              ${shoppingList.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
