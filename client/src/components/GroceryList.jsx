import { useMemo } from "react";
import { useIngredients, useToggleNeeded } from "../state";
import { Button, Card, EmptyState, GroupedList } from "./common";
import { CheckmarkIcon, DeleteIcon } from "./icons";

export default function GroceryList() {
  const { data: ingredients, isLoading, isError } = useIngredients();
  const toggleNeeded = useToggleNeeded();

  const neededItems = useMemo(
    () => ingredients?.filter((i) => i.needed) || [],
    [ingredients],
  );

  if (isLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 font-mono">error loading ingredients</div>;
  }

  if (neededItems.length === 0) {
    return (
      <EmptyState
        message="no items needed. mark ingredients from recipes or the ingredients tab."
        centered
      />
    );
  }

  return (
    <GroupedList
      items={neededItems}
      getCategory={(ingredient) => ingredient.category}
      renderItem={(ingredient) => (
        <Card key={ingredient.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="checkbox"
              active={true}
              onClick={() => toggleNeeded.mutate(ingredient)}
            >
              <CheckmarkIcon />
            </Button>
            <span className="text-text lowercase">{ingredient.name}</span>
          </div>
          <Button
            variant="icon"
            onClick={() => toggleNeeded.mutate(ingredient)}
            aria-label="Remove from grocery list"
          >
            <DeleteIcon />
          </Button>
        </Card>
      )}
    />
  );
}
