import { useMemo } from "react";
import { useConsumableCategories, useConsumables } from "../state";
import Dropdown from "./common/Dropdown";

export default function ConsumableCategoryInput({ value, onChange }) {
  const { data: canonicalCategories = [] } = useConsumableCategories();
  const { data: consumables } = useConsumables();

  const allCategories = useMemo(() => {
    // Get consumable categories that aren't already in canonical list
    const consumableCategories = (consumables || [])
      .map((c) => c.category)
      .filter((c) => c && c.trim() && !canonicalCategories.includes(c));

    // Combine canonical categories with any custom consumable categories
    const combined = new Set([...canonicalCategories, ...consumableCategories]);
    return Array.from(combined).sort();
  }, [canonicalCategories, consumables]);

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
