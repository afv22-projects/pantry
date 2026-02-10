import { useMemo } from "react";
import { useStore } from "../store";
import { Button, Card, EmptyState, GroupedList } from "./common";
import { CheckmarkIcon, DeleteIcon } from "./icons";

export default function GroceryList() {
  const { state, actions } = useStore();

  const neededItems = useMemo(
    () => state.ingredients.filter((i) => i.needed),
    [state.ingredients],
  );

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
              onClick={() => actions.toggleNeeded(ingredient.id)}
            >
              <CheckmarkIcon />
            </Button>
            <span className="text-text lowercase">{ingredient.name}</span>
          </div>
          <Button
            variant="icon"
            onClick={() => actions.toggleNeeded(ingredient.id)}
            aria-label="Remove from grocery list"
          >
            <DeleteIcon />
          </Button>
        </Card>
      )}
    />
  );
}
