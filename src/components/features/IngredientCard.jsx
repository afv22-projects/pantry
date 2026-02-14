import { Link } from "react-router-dom";
import { useIngredientActions } from "../../state";
import { Button, Card } from "../common";
import { CheckmarkIcon } from "../icons";

const styles = {
  card: "flex items-center gap-4",
  cardContent: "flex items-center gap-3",
  cardName: "text-text lowercase",
};

export default function IngredientCard({ ingredient }) {
  const ingredientActions = useIngredientActions(ingredient.id);
  const handleToggleNeeded = (e) => {
    e.preventDefault();
    e.stopPropagation();
    ingredientActions.toggleNeeded.mutate();
  };

  return (
    <Card
      key={ingredient.id}
      as={Link}
      to={`/ingredients/${ingredient.id}`}
      className={styles.card}
    >
      <div className={styles.cardContent}>
        <Button
          variant="checkbox"
          active={ingredient.needed}
          onClick={handleToggleNeeded}
        >
          {ingredient.needed && <CheckmarkIcon />}
        </Button>
        <span className={styles.cardName}>{ingredient.name}</span>
      </div>
    </Card>
  );
}
