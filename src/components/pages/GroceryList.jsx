import { useMemo } from "react";
import {
  useIngredients,
  useToggleNeeded,
  useConsumables,
  useToggleConsumableNeeded,
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
  const toggleIngredientNeeded = useToggleNeeded();
  const toggleConsumableNeeded = useToggleConsumableNeeded();

  const neededItems = useMemo(() => {
    const neededIngredients = (ingredients?.filter((i) => i.needed) || []).map(
      (item) => ({
        ...item,
        type: "ingredient",
      }),
    );
    const neededConsumables = (consumables?.filter((c) => c.needed) || []).map(
      (item) => ({
        ...item,
        type: "consumable",
      }),
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

  const handleToggle = (item) => {
    if (item.type === "ingredient") {
      toggleIngredientNeeded.mutate(item);
    } else {
      toggleConsumableNeeded.mutate(item);
    }
  };

  return (
    <GroupedList
      items={neededItems}
      getCategory={(item) => item.category}
      renderItem={(item) => (
        <Card
          key={`${item.type}-${item.id}`}
          className={styles.cardContainer}
        >
          <div className={styles.itemContent}>
            <Button
              variant="checkbox"
              active={true}
              onClick={() => handleToggle(item)}
            >
              <CheckmarkIcon />
            </Button>
            <span className={styles.itemName}>{item.name}</span>
          </div>
        </Card>
      )}
    />
  );
}
