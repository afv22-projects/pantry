import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";
import RecipeEditor from "./RecipeEditor.jsx";
import { Button } from "./common";
import { parseTags } from "../utils/tags.js";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();

  const recipe = state.recipes.find((r) => r.id === id);

  // Parse tags from comma-separated string to array
  const parsedTags = useMemo(() => {
    return parseTags(recipe?.tags).map((t) => t.toLowerCase());
  }, [recipe?.tags]);

  // Get ingredients for this recipe
  const recipeIngredientIds = useMemo(
    () =>
      state.recipeIngredients
        .filter((ri) => ri.recipe_id === id)
        .map((ri) => ri.ingredient_id),
    [state.recipeIngredients, id],
  );

  const ingredients = useMemo(
    () => state.ingredients.filter((i) => recipeIngredientIds.includes(i.id)),
    [state.ingredients, recipeIngredientIds],
  );

  if (!recipe) {
    return (
      <div className="text-muted font-mono text-sm">
        recipe not found.{" "}
        <Link to="/recipes" className="text-accent hover:underline">
          go back
        </Link>
      </div>
    );
  }

  const handleNameChange = (newName) => {
    actions.updateRecipe(id, { name: newName });
  };

  const handleNotesChange = (newNotes) => {
    actions.updateRecipe(id, { notes: newNotes });
  };

  const handleTagsChange = (newTags) => {
    actions.updateRecipe(id, { tags: newTags.join(",") });
  };

  const handleIngredientsChange = (newIngredients) => {
    const newIds = new Set(newIngredients.map((i) => i.id));
    const oldIds = new Set(ingredients.map((i) => i.id));

    // Find added ingredients
    for (const ingredient of newIngredients) {
      if (!oldIds.has(ingredient.id)) {
        actions.addIngredientToRecipe(id, ingredient.id);
      }
    }

    // Find removed ingredients
    for (const ingredient of ingredients) {
      if (!newIds.has(ingredient.id)) {
        actions.removeIngredientFromRecipe(id, ingredient.id);
      }
    }
  };

  const handleToggleNeeded = (ingredientId) => {
    actions.toggleNeeded(ingredientId);
  };

  const handleDelete = () => {
    if (window.confirm("delete this recipe?")) {
      actions.deleteRecipe(id);
      navigate("/recipes");
    }
  };

  return (
    <div>
      <Link
        to="/recipes"
        className="inline-flex items-center gap-1 text-muted font-mono text-sm mb-4 hover:text-text transition-colors"
      >
        <span>&larr;</span> back
      </Link>

      <RecipeEditor
        name={recipe.name}
        onNameChange={handleNameChange}
        notes={recipe.notes || ""}
        onNotesChange={handleNotesChange}
        tags={parsedTags}
        onTagsChange={handleTagsChange}
        ingredients={ingredients}
        onIngredientsChange={handleIngredientsChange}
        onIngredientToggleNeeded={handleToggleNeeded}
        showNeededIndicator={true}
        nameEditable={true}
      />

      {/* Delete Button */}
      <Button variant="danger" onClick={handleDelete}>
        delete recipe
      </Button>
    </div>
  );
}
