import { Link } from "react-router-dom";
import { useConsumableActions } from "../../state";
import { Button, Card } from "../common";
import { CheckmarkIcon } from "../icons";

const styles = {
  loading: "text-muted font-mono",
  error: "text-red-500 font-mono",
  cardContainer: "flex items-center gap-4",
  itemContent: "flex items-center gap-3",
  itemName: "text-text lowercase",
};

export default function ConsumableCard({ consumable }) {
  const consumableActions = useConsumableActions(consumable.id);

  const handleToggleNeeded = (e) => {
    e.preventDefault();
    e.stopPropagation();
    consumableActions.toggleNeeded.mutate();
  };

  return (
    <Card
      key={consumable.id}
      as={Link}
      to={`/consumables/${consumable.id}`}
      className={styles.cardContainer}
    >
      <div className={styles.itemContent}>
        <Button
          variant="checkbox"
          active={consumable.needed}
          onClick={handleToggleNeeded}
        >
          {consumable.needed && <CheckmarkIcon />}
        </Button>
        <span className={styles.itemName}>{consumable.name}</span>
      </div>
    </Card>
  );
}
