import { useState, useMemo } from "react";
import { useIngredients } from "../state/index.js";
import ChipInput from "./ChipInput.jsx";
import { Button } from "./common/index.jsx";
import DeleteIcon from "./icons/DeleteIcon.jsx";

const styles = {
  nameContainer: "mb-6",
  nameInput:
    "text-2xl font-normal text-text lowercase bg-transparent focus:outline-none w-full placeholder:text-muted border-b border-transparent focus:border-border transition-colors",
  name: "text-2xl font-normal text-text mb-6 lowercase",
  namePlaceholder: "text-muted",
  ingredientsContainer: "mb-8",
  ingredientsTitle:
    "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  ingredientsDisplay:
    "flex flex-wrap gap-2 cursor-pointer border border-border rounded-lg px-3 py-2.5 transition-colors duration-500 hover:border-muted",
  ingredientsPlaceholder: "text-muted font-mono text-sm",
  ingredientChip:
    "inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase cursor-pointer",
  ingredientNeeded: "w-2 h-2 rounded-full bg-accent",
  notesContainer: "mb-8",
  notesTitle: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  notesTextarea:
    "w-full bg-surface border border-border rounded-lg p-3 text-text text-sm resize-none focus:outline-none focus:border-muted",
  notesButtons: "flex gap-2 mt-2",
  notesDisplay:
    "bg-surface rounded-lg p-3 text-sm cursor-pointer hover:border-muted border border-transparent transition-colors",
  notesText: "text-text whitespace-pre-wrap",
  notesPlaceholder: "text-muted font-mono",
  sourceContainer: "mb-8",
  sourceTitle: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  sourceList: "space-y-3 mb-3",
  sourceCard:
    "bg-surface border border-border rounded-lg p-4 flex items-center justify-between group hover:border-muted transition-colors",
  sourceLink: "text-text hover:underline text-sm truncate flex-1 min-w-0",
  sourceInputContainer: "bg-surface border border-border rounded-lg p-3",
  sourceInputField:
    "w-full bg-background border border-border rounded px-3 py-2 text-text text-sm focus:outline-none focus:border-muted mb-3",
  sourceInputButtons: "flex gap-2",
  sourceAddButton:
    "w-full bg-surface border border-border rounded-lg p-3 text-muted font-mono text-sm hover:border-muted transition-colors text-left",
};

function SourceCard({ onRemoveSource, source, index }) {
  return (
    <div key={index} className={styles.sourceCard}>
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sourceLink}
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
  );
}

function SourceInput({
  sourceUrl,
  setSourceUrl,
  handleAddSource,
  handleCancelAddSource,
}) {
  return (
    <div className={styles.sourceInputContainer}>
      <input
        type="url"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        placeholder="paste url"
        className={styles.sourceInputField}
        autoFocus
      />
      <div className={styles.sourceInputButtons}>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddSource}
          disabled={!sourceUrl.trim()}
        >
          add
        </Button>
        <Button variant="secondary" size="sm" onClick={handleCancelAddSource}>
          cancel
        </Button>
      </div>
    </div>
  );
}

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
        (i) =>
          i.name.toLowerCase().includes(input) &&
          !ingredientIdentifiers.has(i.id) &&
          !ingredientIdentifiers.has(i.name.toLowerCase()),
      )
      .slice(0, 5);
  }, [ingredientInput, allIngredients, ingredientIdentifiers]);

  const handleCreateIngredient = (inputValue) => {
    // Check if ingredient already exists
    const existing = allIngredients?.find(
      (i) => i.name.toLowerCase() === inputValue.toLowerCase(),
    );

    if (existing) {
      // Check if it's already in the list
      const alreadyAdded = ingredients.some(
        (i) =>
          (i.id && i.id === existing.id) ||
          (i.name && i.name.toLowerCase() === existing.name.toLowerCase()),
      );
      return alreadyAdded ? null : existing;
    }

    // In create mode, just add the name locally without creating in DB
    if (isCreateMode) return { name: inputValue };

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
    <>
      <section className={styles.nameContainer}>
        {nameEditable ? (
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={(e) => onNameChange(e.target.value.trim())}
            className={styles.nameInput}
            placeholder={namePlaceholder}
          />
        ) : (
          <h2 className={styles.name}>
            {name || (
              <span className={styles.namePlaceholder}>{namePlaceholder}</span>
            )}
          </h2>
        )}
      </section>

      {/* TODO: Bundle static mode into ChipInput */}
      <section className={styles.ingredientsContainer}>
        <h3 className={styles.ingredientsTitle}>Ingredients</h3>
        {isEditingIngredients ? (
          <ChipInput
            items={ingredients}
            onChange={(newIngredients) => onIngredientsChange(newIngredients)}
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
            className={styles.ingredientsDisplay}
          >
            {ingredients.length === 0 ? (
              <p className={styles.ingredientsPlaceholder}>
                click to add ingredients
              </p>
            ) : (
              ingredients.map((ingredient) => (
                <span
                  key={ingredient.id || ingredient.name}
                  onClick={
                    showNeededIndicator &&
                    onIngredientToggleNeeded &&
                    ingredient.id
                      ? (e) => {
                          e.stopPropagation();
                          onIngredientToggleNeeded(ingredient.id);
                        }
                      : undefined
                  }
                  className={styles.ingredientChip}
                >
                  {showNeededIndicator && ingredient.needed && (
                    <span className={styles.ingredientNeeded} />
                  )}
                  {ingredient.name}
                </span>
              ))
            )}
          </div>
        )}
      </section>

      {/* TODO: Extract into textbox component */}
      <section className={styles.notesContainer}>
        <h3 className={styles.notesTitle}>Notes</h3>
        {isEditingNotes ? (
          <div>
            <textarea
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              className={styles.notesTextarea}
              rows={4}
              placeholder="optional cooking notes"
              autoFocus
            />
            <div className={styles.notesButtons}>
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
            className={styles.notesDisplay}
          >
            {notes ? (
              <p className={styles.notesText}>{notes}</p>
            ) : (
              <p className={styles.notesPlaceholder}>click to add notes</p>
            )}
          </div>
        )}
      </section>

      {!isCreateMode && onAddSource && onRemoveSource && (
        <section className={styles.sourceContainer}>
          <h3 className={styles.sourceTitle}>Source</h3>
          {sources.length > 0 && (
            <div className={styles.sourceList}>
              {sources.map((source, index) => (
                <SourceCard source={source} index={index} />
              ))}
            </div>
          )}
          {isAddingSource ? (
            <SourceInput
              sourceUrl={sourceUrl}
              setSourceUrl={setSourceUrl}
              handleAddSource={handleAddSource}
              handleCancelAddSource={handleCancelAddSource}
            />
          ) : (
            <button
              onClick={() => setIsAddingSource(true)}
              className={styles.sourceAddButton}
            >
              click to add source
            </button>
          )}
        </section>
      )}
    </>
  );
}
