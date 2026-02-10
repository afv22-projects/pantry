import { useMemo } from "react";
import { useStore } from "../store";
import Dropdown from "./common/Dropdown";

const DEFAULT_CATEGORIES = [
  "produce",
  "meat",
  "dairy",
  "bakery",
  "frozen",
  "pantry",
  "beverages",
  "snacks",
  "condiments",
  "spices",
];

export default function CategoryInput({ value, onChange }) {
  const { state } = useStore();

  const allCategories = useMemo(() => {
    const ingredientCategories = state.ingredients
      .map((i) => i.category)
      .filter((c) => c && c.trim());
    const combined = new Set([...DEFAULT_CATEGORIES, ...ingredientCategories]);
    return Array.from(combined).sort();
  }, [state.ingredients]);

  const handleSelect = (category) => {
    onChange(category.toLowerCase());
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <Dropdown
      value={value}
      placeholder="select category..."
      searchPlaceholder="search or create..."
      options={allCategories}
      onSelect={handleSelect}
      onClear={handleClear}
      allowCreate={true}
      renderValue={(val) => <span className="lowercase">{val}</span>}
      renderOption={(opt) => <span className="lowercase">{opt}</span>}
    />
  );
}
