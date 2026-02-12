import { useState } from "react";
import { useRecipes } from "../state/index.js";
import RecipeCard from "./RecipeCard.jsx";
import RecipeForm from "./RecipeForm.jsx";
import { Button, EmptyState, Loading, ErrorMessage } from "./common/index.jsx";

const styles = {
  recipeGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  loading: "text-muted font-mono",
};

export default function RecipesPage() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage>error loading recipes</ErrorMessage>;

  return (
    <>
      <div className={styles.recipeGrid}>
        {recipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ingredientCount={recipe.ingredients?.length || 0}
          />
        ))}
      </div>

      {recipes?.length === 0 && (
        <EmptyState message="no recipes yet" centered />
      )}

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </>
  );
}
