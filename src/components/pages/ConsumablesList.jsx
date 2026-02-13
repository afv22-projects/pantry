import { useState } from "react";
import { Link } from "react-router-dom";
import { useConsumables, useConsumableActions } from "../../state";
import { Button, Card, GroupedList, Loading, ErrorMessage } from "../common";
import { CheckmarkIcon } from "../icons";
import ConsumableForm from "../features/ConsumableForm.jsx";

const styles = {
  loading: "text-muted font-mono",
  error: "text-red-500 font-mono",
  cardContainer: "flex items-center gap-4",
  itemContent: "flex items-center gap-3",
  itemName: "text-text lowercase",
};

function ConsumableCard({ consumable }) {
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

export default function ConsumablesList() {
  const { data: consumables, isLoading, isError } = useConsumables();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage>error loading consumables</ErrorMessage>;

  return (
    <>
      <GroupedList
        items={consumables || []}
        getCategory={(consumable) => consumable.category}
        emptyMessage="no consumables yet. add one below."
        renderItem={(consumable) => <ConsumableCard consumable={consumable} />}
      />

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      {showForm && <ConsumableForm onClose={() => setShowForm(false)} />}
    </>
  );
}
