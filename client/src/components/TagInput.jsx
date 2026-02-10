import { useState, useMemo } from "react";
import { useStore } from "../store";

export default function TagInput({ selectedTags, onChange }) {
  const { state } = useStore();
  const [tagInput, setTagInput] = useState("");

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

  // Get suggestions based on input
  const suggestions = useMemo(() => {
    if (!tagInput.trim()) return [];
    const input = tagInput.toLowerCase();
    return allTags
      .filter(
        (tag) =>
          tag.includes(input) && !selectedTags.includes(tag)
      )
      .slice(0, 5);
  }, [tagInput, allTags, selectedTags]);

  const handleAddTag = (tag) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !selectedTags.includes(normalizedTag)) {
      onChange([...selectedTags, normalizedTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAddTag(suggestions[0]);
      } else if (tagInput.trim()) {
        handleAddTag(tagInput);
      }
    }
  };

  return (
    <div>
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-surface border border-border rounded px-2 py-1 text-sm text-text lowercase"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted hover:text-text ml-1"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input with autocomplete */}
      <div className="relative">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text focus:outline-none focus:border-muted"
          placeholder="type tag name, press enter to add"
        />

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10">
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-3 py-2 text-text text-sm hover:bg-border/50 lowercase"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
