import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useRecipe,
  useRecipeActions,
  useIngredients,
  useToggleNeeded,
} from "../../state/index.js";
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
  const { data: allIngredients } = useIngredients();
  const recipeActions = useRecipeActions(id);
  const toggleNeeded = useToggleNeeded();

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
        recipeActions.addIngredient.mutate({
          ingredientName: ingredient.name,
        });
      }
    }

    // Find removed ingredients
    for (const ingredient of ingredients) {
      if (!newIds.has(ingredient.id)) {
        recipeActions.removeIngredient.mutate({
          ingredientName: ingredient.name,
        });
      }
    }
  };

  const handleToggleNeeded = (ingredientId) => {
    const ingredient = allIngredients?.find((i) => i.id === ingredientId);
    if (ingredient) toggleNeeded.mutate(ingredient);
  };

  const handleDelete = () => {
    if (window.confirm("delete this recipe?")) {
      recipeActions.delete.mutate({
        onSuccess: () => {
          navigate("/recipes");
        },
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
        onIngredientToggleNeeded={handleToggleNeeded}
        sources={sources}
        tags={tags}
        onAddSource={recipeActions.addSource.mutate}
        onRemoveSource={recipeActions.removeSource.mutate}
        onAddTag={recipeActions.addTag.mutate}
        onRemoveTag={recipeActions.removeTag.mutate}
        showNeededIndicator={true}
      />

      <Button variant="danger" onClick={handleDelete}>
        delete recipe
      </Button>
    </>
  );
}
