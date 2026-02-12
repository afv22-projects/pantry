import { useState, useEffect, useRef } from "react";

const styles = {
  container: "relative",
  button:
    "w-full flex items-center justify-between bg-surface border border-border rounded-lg px-3 py-2.5 text-left transition-colors hover:border-muted focus:border-muted focus:outline-none",
  valueText: "text-text",
  placeholderText: "text-muted",
  buttonControls: "flex items-center gap-2",
  clearButton: "text-muted hover:text-text cursor-pointer",
  chevron: "w-4 h-4 text-muted transition-transform",
  chevronOpen: "rotate-180",
  dropdown:
    "absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg overflow-hidden z-10",
  searchContainer: "p-2 border-b border-border",
  searchInput:
    "w-full bg-background border border-border rounded px-2 py-1.5 text-text text-sm focus:outline-none focus:border-muted",
  optionsList: "max-h-48 overflow-y-auto",
  option: "w-full text-left px-3 py-2 text-sm hover:bg-border/50",
  optionSelected: "text-accent",
  optionUnselected: "text-text",
  noOptions: "px-3 py-2 text-sm text-muted",
};

export default function Dropdown({
  value,
  placeholder = "select...",
  searchPlaceholder = "search...",
  options = [],
  onSelect,
  onClear,
  renderValue,
  renderOption,
  filterOptions,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setInput("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
      if (filteredOptions.includes(input.trim())) {
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
    <div ref={dropdownRef} className={`${styles.container} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.button}
      >
        <span className={value ? styles.valueText : styles.placeholderText}>
          {displayValue || placeholder}
        </span>
        <div className={styles.buttonControls}>
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
              className={styles.clearButton}
            >
              &times;
            </div>
          )}
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
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
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={searchPlaceholder}
              className={styles.searchInput}
              autoFocus
            />
          </div>
          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`${styles.option} ${
                    option === value ? styles.optionSelected : styles.optionUnselected
                  }`}
                >
                  {renderOption ? renderOption(option) : option}
                </button>
              ))
            ) : (
              <div className={styles.noOptions}>no options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
