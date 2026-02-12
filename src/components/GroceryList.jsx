import { useMemo } from "react";
import {
  useIngredients,
  useToggleNeeded,
  useConsumables,
  useToggleConsumableNeeded,
} from "../state";
import { Button, Card, EmptyState, GroupedList } from "./common";
import { CheckmarkIcon, DeleteIcon } from "./icons";

export default function GroceryList() {
  const { data: ingredients, isLoading: ingredientsLoading, isError: ingredientsError } = useIngredients();
  const { data: consumables, isLoading: consumablesLoading, isError: consumablesError } = useConsumables();
  const toggleNeeded = useToggleNeeded();
  const toggleConsumableNeeded = useToggleConsumableNeeded();

  const neededItems = useMemo(() => {
    const neededIngredients = (ingredients?.filter((i) => i.needed) || []).map(item => ({
      ...item,
      type: 'ingredient',
    }));
    const neededConsumables = (consumables?.filter((c) => c.needed) || []).map(item => ({
      ...item,
      type: 'consumable',
    }));
    return [...neededIngredients, ...neededConsumables];
  }, [ingredients, consumables]);

  if (ingredientsLoading || consumablesLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (ingredientsError || consumablesError) {
    return <div className="text-red-500 font-mono">error loading grocery list</div>;
  }

  if (neededItems.length === 0) {
    return (
      <EmptyState
        message="no items needed. mark ingredients from recipes or the ingredients/consumables tabs."
        centered
      />
    );
  }

  const handleToggle = (item) => {
    if (item.type === 'ingredient') {
      toggleNeeded.mutate(item);
    } else {
      toggleConsumableNeeded.mutate(item);
    }
  };

  return (
    <GroupedList
      items={neededItems}
      getCategory={(item) => item.category}
      renderItem={(item) => (
        <Card key={`${item.type}-${item.id}`} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="checkbox"
              active={true}
              onClick={() => handleToggle(item)}
            >
              <CheckmarkIcon />
            </Button>
            <span className="text-text lowercase">{item.name}</span>
          </div>
          <Button
            variant="icon"
            onClick={() => handleToggle(item)}
            aria-label="Remove from grocery list"
          >
            <DeleteIcon />
          </Button>
        </Card>
      )}
    />
  );
}
