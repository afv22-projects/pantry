import { useState, useMemo } from "react";
import { useIngredients } from "../state/index.js";
import ChipInput from "./ChipInput.jsx";
import { Button } from "./common/index.jsx";
import DeleteIcon from "./icons/DeleteIcon.jsx";

export default function RecipeEditor({
  name,
  onNameChange,
  notes,
  onNotesChange,
  ingredients,
  onIngredientsChange,
  onIngredientToggleNeeded,
  sources = [],
  onAddSource,
  onRemoveSource,
  showNeededIndicator = false,
  namePlaceholder = "recipe name",
  nameEditable = true,
  isCreateMode = false,
}) {
  const { data: allIngredients } = useIngredients();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(notes);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");

  // Get ingredient IDs or names for filtering suggestions
  const ingredientIdentifiers = useMemo(
    () => new Set(ingredients.map((i) => i.id || i.name.toLowerCase())),
    [ingredients],
  );

  // Get suggestions for ingredient autocomplete
  const ingredientSuggestions = useMemo(() => {
    if (!ingredientInput.trim() || !allIngredients) return [];
    const input = ingredientInput.toLowerCase();
    return allIngredients
      .filter(
        (i) => i.name.toLowerCase().includes(input) && !ingredientIdentifiers.has(i.id) && !ingredientIdentifiers.has(i.name.toLowerCase()),
      )
      .slice(0, 5);
  }, [ingredientInput, allIngredients, ingredientIdentifiers]);

  const handleIngredientsChange = (newIngredients) => {
    onIngredientsChange(newIngredients);
  };

  const handleCreateIngredient = (inputValue) => {
    // Check if ingredient already exists
    const existing = allIngredients?.find(
      (i) => i.name.toLowerCase() === inputValue.toLowerCase(),
    );

    if (existing) {
      // Check if it's already in the list
      const alreadyAdded = ingredients.some((i) =>
        (i.id && i.id === existing.id) ||
        (i.name && i.name.toLowerCase() === existing.name.toLowerCase())
      );
      if (!alreadyAdded) {
        // In both modes, return the existing ingredient object
        return existing;
      }
      return null;
    }

    // In create mode, just add the name locally without creating in DB
    if (isCreateMode) {
      return { name: inputValue };
    }

    // In edit mode, return a temporary ingredient object with just the name
    // The parent component (RecipeDetail) will handle adding it to the recipe
    // via addIngredientToRecipe, which creates the ingredient if needed
    return { name: inputValue, id: `temp-${Date.now()}` };
  };

  const handleSaveNotes = () => {
    onNotesChange(editingNotes);
    setIsEditingNotes(false);
  };

  const handleAddSource = () => {
    if (!sourceUrl.trim()) return;
    onAddSource(sourceUrl.trim());
    setSourceUrl("");
    setIsAddingSource(false);
  };

  const handleCancelAddSource = () => {
    setSourceUrl("");
    setIsAddingSource(false);
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
            {name || <span className="text-muted">{namePlaceholder}</span>}
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
            getKey={(i) => i.id || i.name}
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
                  key={ingredient.id || ingredient.name}
                  onClick={
                    showNeededIndicator && onIngredientToggleNeeded && ingredient.id
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

      {/* Source Section */}
      {!isCreateMode && onAddSource && onRemoveSource && (
        <section className="mb-8">
          <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
            Source
          </h3>
          {sources.length > 0 && (
            <div className="space-y-3 mb-3">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between group hover:border-muted transition-colors"
                >
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:underline text-sm truncate flex-1 min-w-0"
                  >
                    {source}
                  </a>
                  <Button
                    onClick={() => onRemoveSource(source)}
                    variant="icon"
                    aria-label="Delete source"
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {isAddingSource ? (
            <div className="bg-surface border border-border rounded-lg p-3">
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="paste url"
                className="w-full bg-background border border-border rounded px-3 py-2 text-text text-sm focus:outline-none focus:border-muted mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddSource}
                  disabled={!sourceUrl.trim()}
                >
                  add
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelAddSource}
                >
                  cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingSource(true)}
              className="w-full bg-surface border border-border rounded-lg p-3 text-muted font-mono text-sm hover:border-muted transition-colors text-left"
            >
              click to add source
            </button>
          )}
        </section>
      )}
    </div>
  );
}
