import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import Button from "./Button.jsx";

export default function IngredientList() {
  const { state, actions } = useStore();

  const groupedIngredients = useMemo(() => {
    const groups = {};

    state.ingredients.forEach((ingredient) => {
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

  const handleToggleNeeded = (e, ingredientId) => {
    e.preventDefault();
    e.stopPropagation();
    actions.toggleNeeded(ingredientId);
  };

  if (state.ingredients.length === 0) {
    return (
      <div className="text-muted font-mono text-sm">
        no ingredients yet. add some from a recipe.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedIngredients.map(({ category, ingredients }) => (
        <section key={category}>
          <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <Link
                key={ingredient.id}
                to={`/ingredients/${ingredient.id}`}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-4 hover:border-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="checkbox"
                    active={ingredient.needed}
                    onClick={(e) => handleToggleNeeded(e, ingredient.id)}
                  >
                    {ingredient.needed && (
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
                    )}
                  </Button>
                  <span className="text-text lowercase">{ingredient.name}</span>
                </div>
                <span className="text-muted">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
