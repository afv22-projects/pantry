import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";
import TagInput from "./TagInput.jsx";
import ChipInput from "./ChipInput.jsx";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();

  const recipe = state.recipes.find((r) => r.id === id);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(recipe?.notes || "");
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");

  // Parse tags from comma-separated string to array
  const recipeTags = recipe?.tags;
  const parsedTags = useMemo(() => {
    if (!recipeTags) return [];
    return recipeTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }, [recipeTags]);

  const [editingTags, setEditingTags] = useState(parsedTags);

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

  // Get suggestions for ingredient autocomplete
  const ingredientSuggestions = useMemo(() => {
    if (!ingredientInput.trim()) return [];
    const input = ingredientInput.toLowerCase();
    return state.ingredients
      .filter(
        (i) =>
          i.name.toLowerCase().includes(input) &&
          !recipeIngredientIds.includes(i.id),
      )
      .slice(0, 5);
  }, [ingredientInput, state.ingredients, recipeIngredientIds]);

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

  const handleToggleNeeded = (ingredientId) => {
    actions.toggleNeeded(ingredientId);
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

  const handleCreateIngredient = (inputValue) => {
    // Check if ingredient already exists
    const existing = state.ingredients.find(
      (i) => i.name.toLowerCase() === inputValue.toLowerCase(),
    );

    if (existing) {
      if (!recipeIngredientIds.includes(existing.id)) {
        return existing;
      }
      return null;
    }

    // Create new ingredient
    return actions.addIngredient(inputValue);
  };

  const handleSaveNotes = () => {
    actions.updateRecipe(id, { notes });
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    if (window.confirm("delete this recipe?")) {
      actions.deleteRecipe(id);
      navigate("/recipes");
    }
  };

  const tagList = parsedTags;

  return (
    <div>
      <Link
        to="/recipes"
        className="inline-flex items-center gap-1 text-muted font-mono text-sm mb-4 hover:text-text transition-colors"
      >
        <span>&larr;</span> back
      </Link>

      <h2 className="text-2xl font-normal text-text mb-6 lowercase">
        {recipe.name}
      </h2>

      {/* Ingredients Section */}
      <section className="mb-8">
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Ingredients
        </h3>
        {isEditingIngredients ? (
          <ChipInput
            items={ingredients}
            onChange={handleIngredientsChange}
            suggestions={ingredientSuggestions}
            getKey={(i) => i.id}
            getLabel={(i) => i.name}
            onCreateNew={handleCreateIngredient}
            placeholder="type ingredient name, press enter to add"
            onInputChange={setIngredientInput}
            onClose={() => setIsEditingIngredients(false)}
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditingIngredients(true)}
            className="flex flex-wrap gap-2 cursor-pointer border border-border rounded-lg px-3 py-2.5 transition-colors duration-500 hover:border-muted"
          >
            {ingredients.length === 0 ? (
              <p className="text-muted font-mono text-sm">
                click to add ingredients
              </p>
            ) : (
              ingredients.map((ingredient) => (
                <span
                  key={ingredient.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleNeeded(ingredient.id);
                  }}
                  className="inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase cursor-pointer"
                >
                  {ingredient.needed && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                  {ingredient.name}
                </span>
              ))
            )}
          </div>
        )}
      </section>

      {/* Notes Section */}
      <section className="mb-8">
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Notes
        </h3>
        {isEditingNotes ? (
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-3 text-text text-sm resize-none focus:outline-none focus:border-muted"
              rows={4}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveNotes}
                className="font-mono text-[12px] px-3 py-1.5 bg-accent text-white rounded"
              >
                save
              </button>
              <button
                onClick={() => {
                  setNotes(recipe.notes || "");
                  setIsEditingNotes(false);
                }}
                className="font-mono text-[12px] px-3 py-1.5 text-muted hover:text-text"
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="bg-surface rounded-lg p-3 text-sm cursor-pointer hover:border-muted border border-transparent transition-colors"
          >
            {recipe.notes ? (
              <p className="text-text whitespace-pre-wrap">{recipe.notes}</p>
            ) : (
              <p className="text-muted font-mono">click to add notes</p>
            )}
          </div>
        )}
      </section>

      {/* Tags Section */}
      <section className="mb-8">
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Tags
        </h3>
        {isEditingTags ? (
          <TagInput
            selectedTags={editingTags}
            onChange={(newTags) => {
              setEditingTags(newTags);
              actions.updateRecipe(id, { tags: newTags.join(",") });
            }}
            onClose={() => setIsEditingTags(false)}
            autoFocus
          />
        ) : (
          <div
            onClick={() => {
              setEditingTags(parsedTags);
              setIsEditingTags(true);
            }}
            className="flex flex-wrap gap-2 cursor-pointer border border-border rounded-lg px-3 py-2.5 transition-colors duration-500 hover:border-muted"
          >
            {tagList.length > 0 ? (
              tagList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-muted font-mono text-sm">click to add tags</p>
            )}
          </div>
        )}
      </section>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="font-mono text-[12px] text-muted hover:text-red-400 transition-colors"
      >
        delete recipe
      </button>
    </div>
  );
}
