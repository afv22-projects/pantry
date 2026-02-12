import { useState } from "react";
import { Button } from "../common/index.jsx";

const styles = {
  container: "bg-surface border border-border rounded-lg p-3",
  addButton:
    "w-full bg-surface border border-border rounded-lg p-3 text-muted font-mono text-sm hover:border-muted transition-colors text-left cursor-pointer",
  inputField:
    "w-full bg-background border border-border rounded px-3 py-2 text-text text-sm focus:outline-none focus:border-muted mb-3",
  buttons: "flex gap-2",
};

export default function RecipeSourceInput({ onAddSource }) {
  const [isAdding, setIsAdding] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");

  const handleAdd = () => {
    if (!sourceUrl.trim()) return;
    onAddSource(sourceUrl.trim());
    setSourceUrl("");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setSourceUrl("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)} className={styles.addButton}>
        click to add source
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <input
        type="url"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        placeholder="paste url"
        className={styles.inputField}
        autoFocus
      />
      <div className={styles.buttons}>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!sourceUrl.trim()}
        >
          add
        </Button>
        <Button variant="secondary" size="sm" onClick={handleCancel}>
          cancel
        </Button>
      </div>
    </div>
  );
}
