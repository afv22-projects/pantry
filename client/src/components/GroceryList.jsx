import { useMemo } from "react";
import { useStore } from "../store";
import Button from "./Button.jsx";
import Card from "./common/Card.jsx";
import CheckmarkIcon from "./common/CheckmarkIcon.jsx";
import EmptyState from "./common/EmptyState.jsx";
import GroupedList from "./common/GroupedList.jsx";

export default function GroceryList() {
  const { state, actions } = useStore();

  const neededItems = useMemo(
    () => state.ingredients.filter((i) => i.needed),
    [state.ingredients]
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
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </Card>
      )}
    />
  );
}
