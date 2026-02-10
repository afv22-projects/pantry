import { useState } from "react";

export default function Dropdown({
  value,
  placeholder = "select...",
  searchPlaceholder = "search or create...",
  options = [],
  onSelect,
  onClear,
  allowCreate = false,
  renderValue,
  renderOption,
  filterOptions,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const defaultFilterOptions = (opts, searchInput) => {
    if (!searchInput.trim()) return opts;
    return opts.filter((opt) =>
      opt.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const filteredOptions = filterOptions
    ? filterOptions(options, input)
    : defaultFilterOptions(options, input);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setInput("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (allowCreate || filteredOptions.includes(input.trim())) {
        handleSelect(input.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInput("");
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    setIsOpen(false);
  };

  const displayValue = renderValue ? renderValue(value) : value;
  const showClearButton = value && onClear;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface border border-border rounded-lg px-3 py-2.5 text-left transition-colors hover:border-muted focus:border-muted focus:outline-none"
      >
        <span className={value ? "text-text" : "text-muted"}>
          {displayValue || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {showClearButton && (
            <div
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear(e);
                }
              }}
              className="text-muted hover:text-text cursor-pointer"
            >
              &times;
            </div>
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
              placeholder={searchPlaceholder}
              className="w-full bg-background border border-border rounded px-2 py-1.5 text-text text-sm focus:outline-none focus:border-muted"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-border/50 ${
                    option === value ? "text-accent" : "text-text"
                  }`}
                >
                  {renderOption ? renderOption(option) : option}
                </button>
              ))
            ) : input.trim() && allowCreate ? (
              <button
                type="button"
                onClick={() => handleSelect(input.trim())}
                className="w-full text-left px-3 py-2 text-sm text-accent hover:bg-border/50"
              >
                create "{input.trim()}"
              </button>
            ) : (
              <div className="px-3 py-2 text-sm text-muted">
                no options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
