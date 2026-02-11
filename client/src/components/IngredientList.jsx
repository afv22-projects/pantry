import { Link } from "react-router-dom";
import { useIngredients, useToggleNeeded } from "../state";
import { Button, Card, GroupedList } from "./common";
import { CheckmarkIcon } from "./icons";

export default function IngredientList() {
  const { data: ingredients, isLoading, isError } = useIngredients();
  const toggleNeeded = useToggleNeeded();

  const handleToggleNeeded = (e, ingredient) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNeeded.mutate(ingredient);
  };

  if (isLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 font-mono">error loading ingredients</div>;
  }

  return (
    <GroupedList
      items={ingredients || []}
      getCategory={(ingredient) => ingredient.category}
      emptyMessage="no ingredients yet. add some from a recipe."
      renderItem={(ingredient) => (
        <Card
          key={ingredient.id}
          as={Link}
          to={`/ingredients/${ingredient.id}`}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="checkbox"
              active={ingredient.needed}
              onClick={(e) => handleToggleNeeded(e, ingredient)}
            >
              {ingredient.needed && <CheckmarkIcon />}
            </Button>
            <span className="text-text lowercase">{ingredient.name}</span>
          </div>
          <span className="text-muted">&rarr;</span>
        </Card>
      )}
    />
  );
}
