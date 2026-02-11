import { useState, useRef, useEffect } from "react";

export default function ChipInput({
  items,
  onChange,
  suggestions = [],
  getKey = (item) => item,
  getLabel = (item) => item,
  onCreateNew,
  placeholder = "type to add...",
  onInputChange,
  onClose,
  autoFocus = false,
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    onInputChange?.(input);
  }, [input, onInputChange]);

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

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleBlur = (e) => {
    // Check if the new focus target is outside our container
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      onClose?.();
    }
  };

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <div
        onClick={handleContainerClick}
        className="flex flex-wrap gap-2 bg-surface border border-border rounded-lg px-3 py-2.5 cursor-text transition-colors duration-500 hover:border-muted focus-within:border-muted"
      >
        {items.map((item) => (
          <span
            key={getKey(item)}
            className="inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase"
          >
            {getLabel(item)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
              className="text-muted hover:text-text ml-1"
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10">
          {suggestions.map((item) => (
            <button
              key={getKey(item)}
              type="button"
              onClick={() => handleAdd(item)}
              className="w-full text-left px-3 py-2 text-text text-sm hover:bg-border/50 lowercase"
            >
              {getLabel(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
