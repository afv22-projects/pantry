import { useState, useMemo } from "react";
import { useIngredients } from "../../state/index.js";
import ChipInput from "./ChipInput.jsx";
import RecipeIngredientChip from "./RecipeIngredientChip.jsx";

export default function RecipeIngredientList({ ingredients, onChange, mode }) {
  const { data: allIngredients } = useIngredients();
  const [ingredientInput, setIngredientInput] = useState("");

  const showNeeded = mode === "live";

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

    // In local mode, just add the name locally without creating in DB
    if (mode === "local") return { name: inputValue };

    // In live mode, return a temporary ingredient object with just the name
    // The parent component (RecipeDetail) will handle adding it to the recipe
    // via addIngredientToRecipe, which creates the ingredient if needed
    return { name: inputValue, id: `temp-${Date.now()}` };
  };

  const renderIngredientChip = (ingredient, key) => (
    <RecipeIngredientChip
      key={key}
      ingredient={ingredient}
      showNeeded={showNeeded}
    />
  );

  return (
    <ChipInput
      items={ingredients}
      onChange={onChange}
      suggestions={ingredientSuggestions}
      getKey={(i) => i.id || i.name}
      getLabel={(i) => i.name}
      onCreateNew={handleCreateIngredient}
      placeholder="click to add ingredients"
      onInputChange={setIngredientInput}
      renderChip={renderIngredientChip}
    />
  );
}
