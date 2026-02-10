import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, ingredientCount }) {
  const tags = recipe.tags
    ? recipe.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block bg-surface border border-border rounded-lg p-5 hover:border-muted transition-colors"
    >
      <h3 className="text-lg font-normal text-text mb-2 lowercase">
        {recipe.name}
      </h3>
      <p className="text-muted font-mono text-[13px] mb-3">
        {ingredientCount} ingredient{ingredientCount !== 1 ? "s" : ""}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-muted border border-border rounded px-1.5 py-0.5 lowercase"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
