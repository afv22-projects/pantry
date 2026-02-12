import { useMemo } from "react";
import { useCategories, useIngredients } from "../state";
import Dropdown from "./common/Dropdown";

export default function CategoryInput({ value, onChange }) {
  const { data: canonicalCategories = [] } = useCategories();
  const { data: ingredients } = useIngredients();

  // TODO: Deprecate custom categories
  const allCategories = useMemo(() => {
    // Get ingredient categories that aren't already in canonical list
    const ingredientCategories = (ingredients || [])
      .map((i) => i.category)
      .filter((c) => c && c.trim() && !canonicalCategories.includes(c));

    // Combine canonical categories with any custom ingredient categories
    const combined = new Set([...canonicalCategories, ...ingredientCategories]);
    return Array.from(combined).sort();
  }, [canonicalCategories, ingredients]);

  return (
    <Dropdown
      value={value}
      placeholder="select category..."
      searchPlaceholder="search or create..."
      options={allCategories}
      onSelect={(category) => onChange(category.toLowerCase())}
      onClear={() => onChange("")}
      allowCreate={true}
      renderValue={(val) => <span className="lowercase">{val}</span>}
      renderOption={(opt) => <span className="lowercase">{opt}</span>}
    />
  );
}
