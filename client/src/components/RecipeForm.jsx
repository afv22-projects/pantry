import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

export default function RecipeForm({ onClose }) {
  const navigate = useNavigate();
  const { state, actions } = useStore();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Get suggestions for ingredient autocomplete
  const suggestions = useMemo(() => {
    if (!ingredientInput.trim()) return [];
    const input = ingredientInput.toLowerCase();
    return state.ingredients
      .filter(
        (i) =>
          i.name.toLowerCase().includes(input) &&
          !selectedIngredients.some((si) => si.id === i.id),
      )
      .slice(0, 5);
  }, [ingredientInput, state.ingredients, selectedIngredients]);

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients((prev) => [...prev, ingredient]);
    setIngredientInput("");
  };

  const handleCreateAndAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;

    // Check if ingredient already exists
    const existing = state.ingredients.find(
      (i) => i.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (existing) {
      if (!selectedIngredients.some((si) => si.id === existing.id)) {
        setSelectedIngredients((prev) => [...prev, existing]);
      }
    } else {
      // Create new ingredient
      const newIngredient = actions.addIngredient(trimmed);
      setSelectedIngredients((prev) => [...prev, newIngredient]);
    }
    setIngredientInput("");
  };

  const handleRemoveIngredient = (ingredientId) => {
    setSelectedIngredients((prev) =>
      prev.filter((i) => i.id !== ingredientId),
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAddIngredient(suggestions[0]);
      } else if (ingredientInput.trim()) {
        handleCreateAndAddIngredient();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Create recipe
    const recipe = actions.addRecipe(name.trim(), notes, tags.toLowerCase());

    // Add ingredients to recipe
    selectedIngredients.forEach((ingredient) => {
      actions.addIngredientToRecipe(recipe.id, ingredient.id);
    });

    navigate(`/recipes/${recipe.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-20 px-4 z-50">
      <div className="bg-bg border border-border rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-normal text-text mb-6 lowercase">
          new recipe
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-5">
            <label className="block font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:border-muted"
              placeholder="recipe name"
              autoFocus
            />
          </div>

          {/* Ingredients */}
          <div className="mb-5">
            <label className="block font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
              Ingredients
            </label>

            {/* Selected ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedIngredients.map((ingredient) => (
                  <span
                    key={ingredient.id}
                    className="inline-flex items-center gap-1 bg-surface border border-border rounded px-2 py-1 text-sm text-text lowercase"
                  >
                    {ingredient.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      className="text-muted hover:text-text ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input with autocomplete */}
            <div className="relative">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:border-muted"
                placeholder="type ingredient name, press enter to add"
              />

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10">
                  {suggestions.map((ingredient) => (
                    <button
                      key={ingredient.id}
                      type="button"
                      onClick={() => handleAddIngredient(ingredient)}
                      className="w-full text-left px-3 py-2 text-text text-sm hover:bg-border/50 lowercase"
                    >
                      {ingredient.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className="block font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text text-sm resize-none focus:outline-none focus:border-muted"
              rows={3}
              placeholder="optional cooking notes"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:border-muted"
              placeholder="comma-separated tags"
            />
          </div>

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
