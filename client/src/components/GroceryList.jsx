import { useMemo } from "react";
import { useStore } from "../store";

export default function GroceryList() {
  const { state, actions } = useStore();

  const groceryItems = useMemo(() => {
    return state.ingredients
      .filter((i) => i.needed)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }, [state.ingredients]);

  if (groceryItems.length === 0) {
    return (
      <div className="text-muted font-mono text-sm text-center py-12">
        no items needed. mark ingredients from recipes or the ingredients tab.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groceryItems.map((ingredient) => (
        <div
          key={ingredient.id}
          className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => actions.toggleNeeded(ingredient.id)}
              className="w-5 h-5 rounded border flex items-center justify-center transition-colors bg-accent border-accent"
            >
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <span className="text-text lowercase">{ingredient.name}</span>
          </div>
          <button
            onClick={() => actions.toggleNeeded(ingredient.id)}
            className="text-muted hover:text-text transition-colors p-1"
            aria-label="Remove from grocery list"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
