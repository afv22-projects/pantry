import { useMemo, useState } from "react";
import { useStore } from "../store";
import ChipInput from "./ChipInput.jsx";

export default function TagInput({ selectedTags, onChange, onClose, autoFocus }) {
  const { state } = useStore();
  const [inputValue, setInputValue] = useState("");

  // Get all unique tags from all recipes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    state.recipes.forEach((recipe) => {
      if (recipe.tags) {
        recipe.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
          .forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [state.recipes]);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const input = inputValue.toLowerCase();
    return allTags
      .filter((tag) => tag.includes(input) && !selectedTags.includes(tag))
      .slice(0, 5);
  }, [inputValue, allTags, selectedTags]);

  return (
    <ChipInput
      items={selectedTags}
      onChange={onChange}
      suggestions={suggestions}
      onCreateNew={(input) => input.toLowerCase().trim()}
      placeholder="type tag name, press enter to add"
      onInputChange={setInputValue}
      onClose={onClose}
      autoFocus={autoFocus}
    />
  );
}
