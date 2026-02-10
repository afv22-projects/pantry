import { useState, useMemo } from "react";
import { useStore } from "../store";
import TagInput from "./TagInput.jsx";
import ChipInput from "./ChipInput.jsx";
import Button from "./Button.jsx";

export default function RecipeEditor({
  name,
  onNameChange,
  notes,
  onNotesChange,
  tags,
  onTagsChange,
  ingredients,
  onIngredientsChange,
  onIngredientToggleNeeded,
  showNeededIndicator = false,
  namePlaceholder = "recipe name",
  nameEditable = true,
}) {
  const { state, actions } = useStore();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(notes);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editingTags, setEditingTags] = useState(tags);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");

  // Get ingredient IDs for filtering suggestions
  const ingredientIds = useMemo(
    () => new Set(ingredients.map((i) => i.id)),
    [ingredients],
  );

  // Get suggestions for ingredient autocomplete
  const ingredientSuggestions = useMemo(() => {
    if (!ingredientInput.trim()) return [];
    const input = ingredientInput.toLowerCase();
    return state.ingredients
      .filter(
        (i) =>
          i.name.toLowerCase().includes(input) && !ingredientIds.has(i.id),
      )
      .slice(0, 5);
  }, [ingredientInput, state.ingredients, ingredientIds]);

  const handleIngredientsChange = (newIngredients) => {
    onIngredientsChange(newIngredients);
  };

  const handleCreateIngredient = (inputValue) => {
    // Check if ingredient already exists
    const existing = state.ingredients.find(
      (i) => i.name.toLowerCase() === inputValue.toLowerCase(),
    );

    if (existing) {
      if (!ingredientIds.has(existing.id)) {
        return existing;
      }
      return null;
    }

    // Create new ingredient
    return actions.addIngredient(inputValue);
  };

  const handleSaveNotes = () => {
    onNotesChange(editingNotes);
    setIsEditingNotes(false);
  };

  return (
    <div>
      {/* Name/Title Section */}
      <section className="mb-6">
        {nameEditable ? (
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={(e) => onNameChange(e.target.value.trim())}
            className="text-2xl font-normal text-text lowercase bg-transparent focus:outline-none w-full placeholder:text-muted border-b border-transparent focus:border-border transition-colors"
            placeholder={namePlaceholder}
          />
        ) : (
          <h2 className="text-2xl font-normal text-text mb-6 lowercase">
            {name || (
              <span className="text-muted">
                {namePlaceholder}
              </span>
            )}
          </h2>
        )}
      </section>

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
                  onClick={
                    showNeededIndicator && onIngredientToggleNeeded
                      ? (e) => {
                        e.stopPropagation();
                        onIngredientToggleNeeded(ingredient.id);
                      }
                      : undefined
                  }
                  className="inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase cursor-pointer"
                >
                  {showNeededIndicator && ingredient.needed && (
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
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-3 text-text text-sm resize-none focus:outline-none focus:border-muted"
              rows={4}
              placeholder="optional cooking notes"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingNotes(notes);
                  setIsEditingNotes(false);
                }}
              >
                cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setEditingNotes(notes);
              setIsEditingNotes(true);
            }}
            className="bg-surface rounded-lg p-3 text-sm cursor-pointer hover:border-muted border border-transparent transition-colors"
          >
            {notes ? (
              <p className="text-text whitespace-pre-wrap">{notes}</p>
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
              onTagsChange(newTags);
            }}
            onClose={() => setIsEditingTags(false)}
            autoFocus
          />
        ) : (
          <div
            onClick={() => {
              setEditingTags(tags);
              setIsEditingTags(true);
            }}
            className="flex flex-wrap gap-2 cursor-pointer border border-border rounded-lg px-3 py-2.5 transition-colors duration-500 hover:border-muted"
          >
            {tags.length > 0 ? (
              tags.map((tag) => (
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
    </div>
  );
}
