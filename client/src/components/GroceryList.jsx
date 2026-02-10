import { useMemo } from "react";
import { useStore } from "../store";
import Button from "./Button.jsx";

export default function GroceryList() {
  const { state, actions } = useStore();

  const groupedGroceryItems = useMemo(() => {
    const neededItems = state.ingredients.filter((i) => i.needed);
    const groups = {};

    neededItems.forEach((ingredient) => {
      const category = ingredient.category?.trim() || "uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(ingredient);
    });

    // Sort ingredients within each group
    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    });

    // Sort categories alphabetically, but keep "uncategorized" at the end
    const sortedCategories = Object.keys(groups).sort((a, b) => {
      if (a === "uncategorized") return 1;
      if (b === "uncategorized") return -1;
      return a.localeCompare(b);
    });

    return sortedCategories.map((category) => ({
      category,
      ingredients: groups[category],
    }));
  }, [state.ingredients]);

  if (groupedGroceryItems.length === 0) {
    return (
      <div className="text-muted font-mono text-sm text-center py-12">
        no items needed. mark ingredients from recipes or the ingredients tab.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedGroceryItems.map(({ category, ingredients }) => (
        <section key={category}>
          <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="checkbox"
                    active={true}
                    onClick={() => actions.toggleNeeded(ingredient.id)}
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
                  </Button>
                  <span className="text-text lowercase">{ingredient.name}</span>
                </div>
                <Button
                  variant="icon"
                  onClick={() => actions.toggleNeeded(ingredient.id)}
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
                </Button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
