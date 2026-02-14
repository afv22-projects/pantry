import { useState } from "react";

const styles = {
  input:
    "bg-surface border border-dashed border-border rounded-full px-3 py-1 text-[12px] text-text font-mono placeholder:text-muted focus:outline-none focus:border-muted transition-colors w-32",
  button:
    "border border-dashed border-border rounded-full px-3 py-1 text-[12px] text-muted hover:text-text hover:border-muted transition-colors font-mono",
};

export default function RecipeTagInput({ onAdd }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue("");
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setValue("");
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (!value.trim()) {
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={styles.button}
        aria-label="Add tag"
      >
        + add tag
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="+ add tag"
        className={styles.input}
        autoFocus
      />
    </form>
  );
}
