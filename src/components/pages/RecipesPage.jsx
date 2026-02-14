import { useState, useMemo } from "react";
import { useRecipes } from "../../state/index.js";
import RecipeCard from "../features/RecipeCard.jsx";
import NewRecipeModal from "../features/NewRecipeModal.jsx";
import { Button, EmptyState, Loading, ErrorMessage } from "../common/index.jsx";

const styles = {
  tagFilter: "flex flex-wrap gap-2 mb-6",
  tagPill:
    "inline-flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-[13px] font-mono cursor-pointer transition-colors lowercase",
  tagPillInactive: "bg-surface border-border text-text hover:border-muted",
  tagPillActive: "bg-accent text-white border-accent font-medium",
  recipeGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  loading: "text-muted font-mono",
};

export default function RecipesPage() {
  const { data: recipes, isLoading, isError } = useRecipes();
  const [showForm, setShowForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const allTags = useMemo(() => {
    if (!recipes) return [];
    const tagSet = new Set();
    recipes.forEach((recipe) => {
      recipe.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    if (!selectedTag) return recipes;
    return recipes.filter((recipe) => recipe.tags?.includes(selectedTag));
  }, [recipes, selectedTag]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage>error loading recipes</ErrorMessage>;

  return (
    <>
      {allTags.length > 0 && (
        <div className={styles.tagFilter}>
          <button
            className={`${styles.tagPill} ${!selectedTag ? styles.tagPillActive : styles.tagPillInactive}`}
            onClick={() => setSelectedTag(null)}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagPill} ${selectedTag === tag ? styles.tagPillActive : styles.tagPillInactive}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className={styles.recipeGrid}>
        {filteredRecipes?.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ingredientCount={recipe.ingredients?.length || 0}
          />
        ))}
      </div>

      {filteredRecipes?.length === 0 && recipes?.length > 0 && (
        <EmptyState message={`no recipes with tag "${selectedTag}"`} centered />
      )}

      {recipes?.length === 0 && (
        <EmptyState message="no recipes yet" centered />
      )}

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      <NewRecipeModal isOpen={showForm} onClose={() => setShowForm(false)} />
    </>
  );
}
