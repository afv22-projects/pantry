import { useState } from "react";
import { useRecipes } from "../state/index.js";
import RecipeCard from "./RecipeCard.jsx";
import RecipeForm from "./RecipeForm.jsx";
import { Button, EmptyState } from "./common/index.jsx";

export default function RecipesPage() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const [showForm, setShowForm] = useState(false);

  // Get ingredient count for each recipe (API returns embedded ingredients)
  const getIngredientCount = (recipe) => {
    return recipe.ingredients?.length || 0;
  };

  if (isLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 font-mono">error loading recipes</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ingredientCount={getIngredientCount(recipe)}
          />
        ))}
      </div>

      {recipes?.length === 0 && (
        <EmptyState
          message="no recipes yet"
          centered
        />
      )}

      <Button variant="fab" onClick={() => setShowForm(true)}>+</Button>
      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
