import { useState, useMemo } from "react";
import { useIngredients } from "../state/index.js";
import ChipInput from "./ChipInput.jsx";
import NotesEditor from "./NotesEditor.jsx";
import RecipeSourceCard from "./RecipeSourceCard.jsx";
import RecipeSourceInput from "./RecipeSourceInput.jsx";

const styles = {
  nameContainer: "mb-6",
  nameInput:
    "text-2xl font-normal text-text lowercase bg-transparent focus:outline-none w-full placeholder:text-muted border-b border-transparent focus:border-border transition-colors",
  name: "text-2xl font-normal text-text mb-6 lowercase",
  namePlaceholder: "text-muted",
  ingredientsContainer: "mb-8",
  ingredientsTitle:
    "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  ingredientChip:
    "inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase cursor-pointer",
  ingredientNeeded: "w-2 h-2 rounded-full bg-accent",
  sourceContainer: "mb-8",
  sourceTitle: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  sourceList: "space-y-3 mb-3",
};

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

  const [ingredientInput, setIngredientInput] = useState("");

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

  const renderIngredientChip = showNeededIndicator
    ? (ingredient, key) => (
        <span
          key={key}
          onClick={
            onIngredientToggleNeeded && ingredient.id
              ? (e) => {
                  e.stopPropagation();
                  onIngredientToggleNeeded(ingredient.id);
                }
              : undefined
          }
          className={styles.ingredientChip}
        >
          {ingredient.needed && <span className={styles.ingredientNeeded} />}
          {ingredient.name}
        </span>
      )
    : undefined;

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

      <section className={styles.ingredientsContainer}>
        <h3 className={styles.ingredientsTitle}>Ingredients</h3>
        <ChipInput
          items={ingredients}
          onChange={onIngredientsChange}
          suggestions={ingredientSuggestions}
          getKey={(i) => i.id || i.name}
          getLabel={(i) => i.name}
          onCreateNew={handleCreateIngredient}
          placeholder="click to add ingredients"
          onInputChange={setIngredientInput}
          renderChip={renderIngredientChip}
        />
      </section>

      <NotesEditor notes={notes} onNotesChange={onNotesChange} />

      {!isCreateMode && onAddSource && onRemoveSource && (
        <section className={styles.sourceContainer}>
          <h3 className={styles.sourceTitle}>Source</h3>
          {sources.length > 0 && (
            <div className={styles.sourceList}>
              {sources.map((source, index) => (
                <RecipeSourceCard
                  key={index}
                  source={source}
                  index={index}
                  onRemoveSource={onRemoveSource}
                />
              ))}
            </div>
          )}
          <RecipeSourceInput onAddSource={onAddSource} />
        </section>
      )}
    </>
  );
}
