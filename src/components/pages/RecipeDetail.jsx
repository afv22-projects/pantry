import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecipe, useRecipeActions } from "../../state/index.js";
import RecipeEditor from "../features/RecipeEditor.jsx";
import { Button, BackLink, Loading } from "../common/index.jsx";

const styles = {
  missingRecipe: "text-muted font-mono text-sm",
  missingRecipeLink: "text-accent hover:underline",
};

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isLoading: recipeLoading } = useRecipe(id);
  const recipeActions = useRecipeActions(id);

  if (recipeLoading) return <Loading />;

  if (!recipe) {
    return (
      <div className={styles.missingRecipe}>
        recipe not found.{" "}
        <Link to="/recipes" className={styles.missingRecipeLink}>
          go back
        </Link>
      </div>
    );
  }

  const ingredients = recipe.ingredients;
  const sources = recipe.sources;
  const tags = recipe.tags;

  const handleNameChange = (newName) => {
    recipeActions.update.mutate({ name: newName });
  };

  const handleNotesChange = (newNotes) => {
    recipeActions.update.mutate({ notes: newNotes });
  };

  const handleIngredientsChange = (newIngredients) => {
    const newIds = new Set(newIngredients.map((i) => i.id));
    const oldIds = new Set(ingredients.map((i) => i.id));

    // Find added ingredients
    for (const ingredient of newIngredients) {
      if (!oldIds.has(ingredient.id)) {
        recipeActions.addIngredient.mutate(ingredient.name);
      }
    }

    // Find removed ingredients
    for (const ingredient of ingredients) {
      if (!newIds.has(ingredient.id)) {
        recipeActions.removeIngredient.mutate(ingredient.name);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("delete this recipe?")) {
      navigate("/recipes");
      recipeActions.delete.mutate(undefined, {
        onError: (error) => {
          console.error("Failed to delete recipe:", error);
          alert("Failed to delete recipe. Please try again.");
        },
      });
    }
  };

  return (
    <>
      <BackLink to="/recipes" />

      <RecipeEditor
        name={recipe.name}
        onNameChange={handleNameChange}
        notes={recipe.notes || ""}
        onNotesChange={handleNotesChange}
        ingredients={ingredients}
        onIngredientsChange={handleIngredientsChange}
        sources={sources}
        tags={tags}
        onAddSource={recipeActions.addSource.mutate}
        onRemoveSource={recipeActions.removeSource.mutate}
        onAddTag={recipeActions.addTag.mutate}
        onRemoveTag={recipeActions.removeTag.mutate}
        mode="live"
      />

      <Button variant="danger" onClick={handleDelete}>
        delete recipe
      </Button>
    </>
  );
}
