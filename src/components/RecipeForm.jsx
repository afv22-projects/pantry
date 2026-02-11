import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRecipe } from "../state/index.js";
import RecipeEditor from "./RecipeEditor.jsx";
import { Button } from "./common/index.jsx";

export default function RecipeForm({ onClose }) {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Create recipe with ingredients array
    createRecipe.mutate(
      {
        name: name.trim(),
        notes,
        ingredients: ingredients.map(i => i.name),
      },
      {
        onSuccess: (recipe) => {
          navigate(`/recipes/${recipe.id}`);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center py-8 px-4 z-50 overflow-y-auto">
      <div className="bg-bg border border-border rounded-lg w-full max-w-lg p-6 mb-8">
        <h2 className="text-xl font-normal text-text mb-6 lowercase">
          new recipe
        </h2>

        <form onSubmit={handleSubmit}>
          <RecipeEditor
            name={name}
            onNameChange={setName}
            notes={notes}
            onNotesChange={setNotes}
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
            showNeededIndicator={false}
            namePlaceholder="recipe name"
            nameEditable={true}
            isCreateMode={true}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!name.trim() || createRecipe.isPending}
              className="flex-1"
            >
              {createRecipe.isPending ? "creating..." : "create recipe"}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
