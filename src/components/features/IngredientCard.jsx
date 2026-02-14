import { useIngredientActions } from "../../state";
import ItemCard from "./ItemCard";

export default function IngredientCard({ ingredient, linkTo = null }) {
  const ingredientActions = useIngredientActions(ingredient.id);

  return (
    <ItemCard
      name={ingredient.name}
      needed={ingredient.needed}
      onToggle={() =>
        ingredientActions.update.mutate({ needed: !ingredient.needed })
      }
      linkTo={linkTo}
    />
  );
}
