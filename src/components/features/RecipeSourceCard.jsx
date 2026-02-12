import { Button } from "../common/index.jsx";
import DeleteIcon from "../icons/DeleteIcon.jsx";

const styles = {
  sourceCard:
    "bg-surface border border-border rounded-lg p-4 flex items-center justify-between group hover:border-muted transition-colors",
  sourceLink: "text-text hover:underline text-sm truncate flex-1 min-w-0",
};

export default function RecipeSourceCard({ onRemoveSource, source, index }) {
  return (
    <div key={index} className={styles.sourceCard}>
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sourceLink}
      >
        {source}
      </a>
      <Button
        onClick={() => onRemoveSource(source)}
        variant="icon"
        aria-label="Delete source"
      >
        <DeleteIcon />
      </Button>
    </div>
  );
}
