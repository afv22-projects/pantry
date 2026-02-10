import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import RecipeEditor from "./RecipeEditor.jsx";

export default function RecipeForm({ onClose }) {
  const navigate = useNavigate();
  const { actions } = useStore();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Create recipe
    const recipe = actions.addRecipe(name.trim(), notes, tags.join(","));

    // Add ingredients to recipe
    ingredients.forEach((ingredient) => {
      actions.addIngredientToRecipe(recipe.id, ingredient.id);
    });

    navigate(`/recipes/${recipe.id}`);
    onClose();
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
            tags={tags}
            onTagsChange={setTags}
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
            showNeededIndicator={false}
            namePlaceholder="recipe name"
            nameEditable={true}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-accent text-white font-mono text-[13px] py-2.5 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              create recipe
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 font-mono text-[13px] text-muted hover:text-text transition-colors"
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
