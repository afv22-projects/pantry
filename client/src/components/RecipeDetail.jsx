import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();

  const recipe = state.recipes.find((r) => r.id === id);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(recipe?.notes || "");
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tags, setTags] = useState(recipe?.tags || "");

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

  // Get ingredients for this recipe
  const recipeIngredientIds = state.recipeIngredients
    .filter((ri) => ri.recipe_id === id)
    .map((ri) => ri.ingredient_id);

  const ingredients = state.ingredients.filter((i) =>
    recipeIngredientIds.includes(i.id),
  );

  const handleToggleNeeded = (ingredientId) => {
    actions.toggleNeeded(ingredientId);
  };

  const handleSaveNotes = () => {
    actions.updateRecipe(id, { notes });
    setIsEditingNotes(false);
  };

  const handleSaveTags = () => {
    actions.updateRecipe(id, { tags: tags.toLowerCase() });
    setIsEditingTags(false);
  };

  const handleDelete = () => {
    if (window.confirm("delete this recipe?")) {
      actions.deleteRecipe(id);
      navigate("/recipes");
    }
  };

  const tagList = recipe.tags
    ? recipe.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

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
        {ingredients.length === 0 ? (
          <p className="text-muted font-mono text-sm">no ingredients yet</p>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between bg-surface rounded-lg px-4 py-3"
              >
                <span className="text-text lowercase">{ingredient.name}</span>
                <button
                  onClick={() => handleToggleNeeded(ingredient.id)}
                  className={`font-mono text-[12px] px-3 py-1.5 rounded border transition-colors ${
                    ingredient.needed
                      ? "bg-accent text-white border-accent"
                      : "text-muted border-border hover:border-muted"
                  }`}
                >
                  {ingredient.needed ? "needed" : "+ need"}
                </button>
              </div>
            ))}
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
          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma-separated tags"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-muted"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveTags}
                className="font-mono text-[12px] px-3 py-1.5 bg-accent text-white rounded"
              >
                save
              </button>
              <button
                onClick={() => {
                  setTags(recipe.tags || "");
                  setIsEditingTags(false);
                }}
                className="font-mono text-[12px] px-3 py-1.5 text-muted hover:text-text"
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingTags(true)}
            className="cursor-pointer"
          >
            {tagList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] text-muted border border-border rounded px-1.5 py-0.5 lowercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
