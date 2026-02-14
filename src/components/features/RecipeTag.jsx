const styles = {
  tag: "inline-flex items-center gap-1.5 bg-surface border border-border rounded-full px-3 py-1 text-[12px] text-text font-mono group hover:border-muted transition-colors",
  removeButton:
    "text-muted hover:text-text transition-colors cursor-pointer leading-none",
};

export default function RecipeTag({ tag, onRemove }) {
  return (
    <div className={styles.tag}>
      <span>{tag}</span>
      <button
        onClick={() => onRemove(tag)}
        className={styles.removeButton}
        aria-label={`Remove tag ${tag}`}
      >
        ×
      </button>
    </div>
  );
}
