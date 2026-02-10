import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";

export default function IngredientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();

  const ingredient = state.ingredients.find((i) => i.id === id);

  const recipesUsingIngredient = useMemo(() => {
    if (!ingredient) return [];

    const recipeIds = state.recipeIngredients
      .filter((ri) => ri.ingredient_id === id)
      .map((ri) => ri.recipe_id);

    return state.recipes.filter((r) => recipeIds.includes(r.id));
  }, [ingredient, id, state.recipeIngredients, state.recipes]);

  if (!ingredient) {
    return (
      <div className="text-muted font-mono text-sm">
        ingredient not found.{" "}
        <Link to="/ingredients" className="text-accent hover:underline">
          go back
        </Link>
      </div>
    );
  }

  const handleToggleNeeded = () => {
    actions.toggleNeeded(id);
  };

  return (
    <div>
      <Link
        to="/ingredients"
        className="inline-flex items-center gap-1 text-muted font-mono text-sm mb-4 hover:text-text transition-colors"
      >
        <span>&larr;</span> back
      </Link>

      <h2 className="text-2xl font-normal text-text mb-6 lowercase">
        {ingredient.name}
      </h2>

      <button
        onClick={handleToggleNeeded}
        className={`font-mono text-[14px] px-4 py-3 rounded border transition-colors mb-8 ${
          ingredient.needed
            ? "bg-accent text-white border-accent"
            : "text-muted border-border hover:border-muted"
        }`}
      >
        {ingredient.needed ? "marked as needed" : "+ mark as needed"}
      </button>

      <section>
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Used In
        </h3>
        {recipesUsingIngredient.length === 0 ? (
          <p className="text-muted font-mono text-sm">
            not used in any recipes yet
          </p>
        ) : (
          <div className="space-y-2">
            {recipesUsingIngredient.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="block bg-surface border border-border rounded-lg px-4 py-4 hover:border-muted transition-colors"
              >
                <span className="text-text lowercase">{recipe.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => {
          if (window.confirm("delete this ingredient?")) {
            actions.deleteIngredient(id);
            navigate("/ingredients");
          }
        }}
        className="font-mono text-[12px] text-muted hover:text-red-400 transition-colors mt-8"
      >
        delete ingredient
      </button>
    </div>
  );
}
