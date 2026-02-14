import { Link } from "react-router-dom";
import { Button, Card } from "../common";
import { CheckmarkIcon } from "../icons";

const styles = {
  cardContainer: "flex items-center gap-4",
  itemContent: "flex items-center gap-3",
  itemName: "text-text lowercase",
};

export default function ItemCard({ name, needed, onToggle, linkTo }) {
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <Card
      as={linkTo ? Link : undefined}
      to={linkTo}
      className={styles.cardContainer}
    >
      <div className={styles.itemContent}>
        <Button variant="checkbox" active={needed} onClick={handleToggle}>
          {needed && <CheckmarkIcon />}
        </Button>
        <span className={styles.itemName}>{name}</span>
      </div>
    </Card>
  );
}
