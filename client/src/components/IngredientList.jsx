import { Link } from "react-router-dom";
import { useStore } from "../store";
import { Button, Card, GroupedList } from "./common";
import { CheckmarkIcon } from "./icons";

export default function IngredientList() {
  const { state, actions } = useStore();

  const handleToggleNeeded = (e, ingredientId) => {
    e.preventDefault();
    e.stopPropagation();
    actions.toggleNeeded(ingredientId);
  };

  return (
    <GroupedList
      items={state.ingredients}
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
              onClick={(e) => handleToggleNeeded(e, ingredient.id)}
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
