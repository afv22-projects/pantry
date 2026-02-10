import { useState, useMemo } from "react";
import { useStore } from "../store";
import RecipeCard from "./RecipeCard.jsx";
import TagFilter from "./TagFilter.jsx";
import RecipeForm from "./RecipeForm.jsx";
import Button from "./Button.jsx";

export default function RecipesPage() {
  const { state } = useStore();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Get all unique tags from all recipes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    state.recipes.forEach((recipe) => {
      if (recipe.tags) {
        recipe.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
          .forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [state.recipes]);

  // Get ingredient count for each recipe
  const getIngredientCount = (recipeId) => {
    return state.recipeIngredients.filter((ri) => ri.recipe_id === recipeId)
      .length;
  };

  // Filter recipes by selected tags (AND logic)
  const filteredRecipes = useMemo(() => {
    if (selectedTags.length === 0) return state.recipes;

    return state.recipes.filter((recipe) => {
      const recipeTags = recipe.tags
        ? recipe.tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : [];
      return selectedTags.every((tag) => recipeTags.includes(tag));
    });
  }, [state.recipes, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <div>
      {allTags.length > 0 && (
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClear={handleClearTags}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ingredientCount={getIngredientCount(recipe.id)}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <p className="text-muted font-mono text-sm text-center py-12">
          {state.recipes.length === 0
            ? "no recipes yet"
            : "no recipes match the selected tags"}
        </p>
      )}

      {/* Add Recipe Button */}
      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>

      {/* Recipe Form Modal */}
      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
