import { useMemo } from "react";
import {
  useIngredients,
  useIngredientActions,
  useConsumables,
  useConsumableActions,
} from "../../state";
import {
  Button,
  Card,
  EmptyState,
  GroupedList,
  Loading,
  ErrorMessage,
} from "../common";
import { CheckmarkIcon } from "../icons";

const styles = {
  cardContainer: "flex items-center justify-between",
  itemContent: "flex items-center gap-3",
  itemName: "text-text lowercase",
};

function ItemButton({ name, onToggle }) {
  return (
    <Card className={styles.cardContainer}>
      <div className={styles.itemContent}>
        <Button variant="checkbox" active={true} onClick={onToggle}>
          <CheckmarkIcon />
        </Button>
        <span className={styles.itemName}>{name}</span>
      </div>
    </Card>
  );
}

function IngredientButton({ item }) {
  const ingredientActions = useIngredientActions(item.id);
  const handleToggle = () => ingredientActions.toggleNeeded.mutate();

  return <ItemButton name={item.name} onToggle={handleToggle} />;
}

function ConsumableButton({ item }) {
  const consumableActions = useConsumableActions(item.id);
  const handleToggle = () => consumableActions.toggleNeeded.mutate();

  return <ItemButton name={item.name} onToggle={handleToggle} />;
}

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
          <IngredientButton key={`ingredient-${item.id}`} item={item} />
        ) : (
          <ConsumableButton key={`consumable-${item.id}`} item={item} />
        )
      }
    />
  );
}
