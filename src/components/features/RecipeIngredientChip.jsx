import { useIngredientActions } from "../../state";

const styles = {
  chip: "inline-flex items-center gap-1 bg-background border border-border rounded px-2 py-1 text-sm text-text lowercase cursor-pointer",
  neededIndicator: "w-2 h-2 rounded-full bg-accent",
};

export default function RecipeIngredientChip({ ingredient, showNeeded }) {
  const ingredientActions = useIngredientActions(ingredient.id);

  const handleClick = (e) => {
    if (!showNeeded || !ingredient.id) return;
    e.stopPropagation();
    ingredientActions.toggleNeeded.mutate({ needed: ingredient.needed });
  };

  return (
    <span onClick={handleClick} className={styles.chip}>
      {showNeeded && ingredient.needed && (
        <span className={styles.neededIndicator} />
      )}
      {ingredient.name}
    </span>
  );
}
