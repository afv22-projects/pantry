import { useState, useMemo } from "react";
import { useRecipes } from "../state";
import RecipeCard from "./RecipeCard.jsx";
import TagFilter from "./TagFilter.jsx";
import RecipeForm from "./RecipeForm.jsx";
import { Button, EmptyState } from "./common";
import { parseTags } from "../utils/tags.js";

export default function RecipesPage() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Get all unique tags from all recipes
  const allTags = useMemo(() => {
    if (!recipes) return [];
    const tagSet = new Set();
    recipes.forEach((recipe) => {
      parseTags(recipe.tags)
        .map((t) => t.toLowerCase())
        .forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  // Get ingredient count for each recipe (API returns embedded ingredients)
  const getIngredientCount = (recipe) => {
    return recipe.ingredients?.length || 0;
  };

  // Filter recipes by selected tags (AND logic)
  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    if (selectedTags.length === 0) return recipes;

    return recipes.filter((recipe) => {
      const recipeTags = parseTags(recipe.tags).map((t) => t.toLowerCase());
      return selectedTags.every((tag) => recipeTags.includes(tag));
    });
  }, [recipes, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  if (isLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 font-mono">error loading recipes</div>;
  }

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
            ingredientCount={getIngredientCount(recipe)}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <EmptyState
          message={
            (recipes?.length || 0) === 0
              ? "no recipes yet"
              : "no recipes match the selected tags"
          }
          centered
        />
      )}

      <Button variant="fab" onClick={() => setShowForm(true)}>+</Button>
      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
