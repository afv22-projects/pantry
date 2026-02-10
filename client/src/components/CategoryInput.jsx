import { useState, useMemo } from "react";
import { useStore } from "../store";

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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const allCategories = useMemo(() => {
    const ingredientCategories = state.ingredients
      .map((i) => i.category)
      .filter((c) => c && c.trim());
    const combined = new Set([...DEFAULT_CATEGORIES, ...ingredientCategories]);
    return Array.from(combined).sort();
  }, [state.ingredients]);

  const filteredCategories = useMemo(() => {
    if (!input.trim()) return allCategories;
    return allCategories.filter((c) =>
      c.toLowerCase().includes(input.toLowerCase())
    );
  }, [allCategories, input]);

  const handleSelect = (category) => {
    onChange(category.toLowerCase());
    setIsOpen(false);
    setInput("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      handleSelect(input.trim());
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInput("");
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface border border-border rounded-lg px-3 py-2.5 text-left transition-colors hover:border-muted focus:border-muted focus:outline-none"
      >
        <span className={value ? "text-text lowercase" : "text-muted"}>
          {value || "select category..."}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted hover:text-text"
            >
              &times;
            </button>
          )}
          <svg
            className={`w-4 h-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="search or create..."
              className="w-full bg-background border border-border rounded px-2 py-1.5 text-text text-sm focus:outline-none focus:border-muted"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelect(category)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-border/50 lowercase ${
                    category === value ? "text-accent" : "text-text"
                  }`}
                >
                  {category}
                </button>
              ))
            ) : input.trim() ? (
              <button
                type="button"
                onClick={() => handleSelect(input.trim())}
                className="w-full text-left px-3 py-2 text-sm text-accent hover:bg-border/50"
              >
                create "{input.trim().toLowerCase()}"
              </button>
            ) : (
              <div className="px-3 py-2 text-sm text-muted">
                no categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
