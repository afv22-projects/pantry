import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

const styles = {
  container:
    "flex flex-wrap gap-2 border border-border rounded-lg px-3 py-2.5 transition-colors duration-500 hover:border-muted",
  containerEditing: "bg-surface cursor-text focus-within:border-muted",
  containerStatic: "cursor-pointer",
  chip: "inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase",
  chipRemove: "text-muted hover:text-text ml-1",
  placeholder: "text-muted font-mono text-sm",
  suggestionsContainer:
    "absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10",
  suggestion:
    "w-full text-left px-3 py-2 text-text text-sm hover:bg-border/50 lowercase",
};

export default function ChipInput({
  items,
  onChange,
  suggestions = [],
  getKey = (item) => item,
  getLabel = (item) => item,
  onCreateNew,
  placeholder = "click to add...",
  onInputChange,
  renderChip,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => onInputChange?.(input), [input, onInputChange]);

  useClickOutside(containerRef, () => setIsEditing(false), isEditing);

  const handleAdd = (item) => {
    const key = getKey(item);
    const exists = items.some((i) => getKey(i) === key);
    if (!exists) {
      onChange([...items, item]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const handleRemove = (itemToRemove) => {
    onChange(items.filter((item) => getKey(item) !== getKey(itemToRemove)));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAdd(suggestions[0]);
      } else if (input.trim() && onCreateNew) {
        const newItem = onCreateNew(input.trim());
        if (newItem) {
          handleAdd(newItem);
        } else {
          setInput("");
        }
      }
    } else if (e.key === "Backspace" && !input && items.length > 0) {
      handleRemove(items[items.length - 1]);
    }
  };

  const containerClass = `${styles.container} ${isEditing ? styles.containerEditing : styles.containerStatic}`;

  if (!isEditing) {
    return (
      <div onClick={() => setIsEditing(true)} className={containerClass}>
        {items.length === 0 ? (
          <p className={styles.placeholder}>{placeholder}</p>
        ) : (
          items.map((item) =>
            renderChip ? (
              renderChip(item, getKey(item))
            ) : (
              <span key={getKey(item)} className={styles.chip}>
                {getLabel(item)}
              </span>
            ),
          )
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => inputRef.current?.focus()} className={containerClass}>
        {items.map((item) => (
          <span key={getKey(item)} className={styles.chip}>
            {getLabel(item)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
              className={styles.chipRemove}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-30 bg-transparent text-text focus:outline-none"
          placeholder={items.length === 0 ? placeholder : ""}
        />
      </div>

      {suggestions.length > 0 && (
        <div className={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <button
              key={getKey(item)}
              type="button"
              onClick={() => handleAdd(item)}
              className={styles.suggestion}
            >
              {getLabel(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
