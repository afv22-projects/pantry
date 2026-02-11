export default function TagFilter({ tags, selectedTags, onTagToggle, onClear }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      <button
        onClick={onClear}
        className={`font-mono text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
          selectedTags.length === 0
            ? "bg-accent text-white border-accent"
            : "text-muted border-border hover:border-muted"
        }`}
      >
        all
      </button>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`font-mono text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors lowercase ${
              isSelected
                ? "bg-accent text-white border-accent"
                : "text-muted border-border hover:border-muted"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
