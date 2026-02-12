import { useState } from "react";
import { Link } from "react-router-dom";
import { useConsumables, useToggleConsumableNeeded } from "../../state";
import { Button, Card, GroupedList, Loading, ErrorMessage } from "../common";
import { CheckmarkIcon } from "../icons";
import ConsumableForm from "../features/ConsumableForm.jsx";

const styles = {
  loading: "text-muted font-mono",
  error: "text-red-500 font-mono",
  cardContainer: "flex items-center justify-between",
  itemContent: "flex items-center gap-3",
  itemName: "text-text lowercase",
  arrow: "text-muted",
};

export default function ConsumablesList() {
  const { data: consumables, isLoading, isError } = useConsumables();
  const toggleNeeded = useToggleConsumableNeeded();
  const [showForm, setShowForm] = useState(false);

  const handleToggleNeeded = (e, consumable) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNeeded.mutate(consumable);
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage>error loading consumables</ErrorMessage>;

  return (
    <>
      <GroupedList
        items={consumables || []}
        getCategory={(consumable) => consumable.category}
        emptyMessage="no consumables yet. add one below."
        renderItem={(consumable) => (
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
                onClick={(e) => handleToggleNeeded(e, consumable)}
              >
                {consumable.needed && <CheckmarkIcon />}
              </Button>
              <span className={styles.itemName}>{consumable.name}</span>
            </div>
            <span className={styles.arrow}>&rarr;</span>
          </Card>
        )}
      />

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      {showForm && <ConsumableForm onClose={() => setShowForm(false)} />}
    </>
  );
}
