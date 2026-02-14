import { useMemo } from "react";
import { useIngredients, useConsumables } from "../../state";
import { EmptyState, GroupedList, Loading, ErrorMessage } from "../common";
import IngredientCard from "../features/IngredientCard";
import ConsumableCard from "../features/ConsumableCard";

export default function GroceryList() {
  const {
    data: ingredients,
    isLoading: ingredientsLoading,
    isError: ingredientsError,
  } = useIngredients();
  const {
    data: consumables,
    isLoading: consumablesLoading,
    isError: consumablesError,
  } = useConsumables();
  const neededItems = useMemo(() => {
    const neededIngredients = (ingredients?.filter((i) => i.needed) || []).map(
      (item) => ({ ...item, type: "ingredient" }),
    );
    const neededConsumables = (consumables?.filter((c) => c.needed) || []).map(
      (item) => ({ ...item, type: "consumable" }),
    );
    return [...neededIngredients, ...neededConsumables];
  }, [ingredients, consumables]);

  if (ingredientsLoading || consumablesLoading) return <Loading />;
  if (ingredientsError || consumablesError) {
    return <ErrorMessage>error loading grocery list</ErrorMessage>;
  }

  if (neededItems.length === 0) {
    const emptyMsg =
      "no items needed. mark ingredients from recipes or the ingredients/consumables tabs.";
    return <EmptyState message={emptyMsg} centered />;
  }

  return (
    <GroupedList
      items={neededItems}
      getCategory={(item) => item.category}
      renderItem={(item) =>
        item.type === "ingredient" ? (
          <IngredientCard key={`ingredient-${item.id}`} ingredient={item} />
        ) : (
          <ConsumableCard key={`consumable-${item.id}`} consumable={item} />
        )
      }
    />
  );
}
