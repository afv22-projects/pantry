import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useRecipe,
  useIngredients,
  useUpdateRecipe,
  useDeleteRecipe,
  useAddIngredientToRecipe,
  useRemoveIngredientFromRecipe,
  useToggleNeeded,
} from "../state";
import RecipeEditor from "./RecipeEditor.jsx";
import { Button, BackLink } from "./common";
import { parseTags } from "../utils/tags.js";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isLoading: recipeLoading } = useRecipe(id);
  const { data: allIngredients } = useIngredients();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();
  const addIngredientToRecipe = useAddIngredientToRecipe();
  const removeIngredientFromRecipe = useRemoveIngredientFromRecipe();
  const toggleNeeded = useToggleNeeded();

  // Parse tags from comma-separated string to array
  const parsedTags = useMemo(() => {
    return parseTags(recipe?.tags).map((t) => t.toLowerCase());
  }, [recipe?.tags]);

  // API returns ingredients embedded in recipe
  const ingredients = recipe?.ingredients || [];

  if (recipeLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

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
    updateRecipe.mutate({ id, name: newName });
  };

  const handleNotesChange = (newNotes) => {
    updateRecipe.mutate({ id, notes: newNotes });
  };

  const handleTagsChange = (newTags) => {
    updateRecipe.mutate({ id, tags: newTags.join(",") });
  };

  const handleIngredientsChange = (newIngredients) => {
    const newIds = new Set(newIngredients.map((i) => i.id));
    const oldIds = new Set(ingredients.map((i) => i.id));

    // Find added ingredients
    for (const ingredient of newIngredients) {
      if (!oldIds.has(ingredient.id)) {
        addIngredientToRecipe.mutate({ recipeId: id, ingredientId: ingredient.id });
      }
    }

    // Find removed ingredients
    for (const ingredient of ingredients) {
      if (!newIds.has(ingredient.id)) {
        removeIngredientFromRecipe.mutate({ recipeId: id, ingredientId: ingredient.id });
      }
    }
  };

  const handleToggleNeeded = (ingredientId) => {
    const ingredient = allIngredients?.find((i) => i.id === ingredientId);
    if (ingredient) {
      toggleNeeded.mutate(ingredient);
    }
  };

  const handleDelete = () => {
    if (window.confirm("delete this recipe?")) {
      deleteRecipe.mutate(id, {
        onSuccess: () => navigate("/recipes"),
      });
    }
  };

  return (
    <div>
      <BackLink to="/recipes" />

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

      <Button variant="danger" onClick={handleDelete}>
        delete recipe
      </Button>
    </div>
  );
}
