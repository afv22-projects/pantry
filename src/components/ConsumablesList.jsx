import { useState } from "react";
import { useConsumables, useToggleConsumableNeeded } from "../state";
import { Button, Card, GroupedList } from "./common";
import { CheckmarkIcon } from "./icons";
import ConsumableForm from "./ConsumableForm.jsx";

export default function ConsumablesList() {
  const { data: consumables, isLoading, isError } = useConsumables();
  const toggleNeeded = useToggleConsumableNeeded();
  const [showForm, setShowForm] = useState(false);

  const handleToggleNeeded = (e, consumable) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNeeded.mutate(consumable);
  };

  if (isLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500 font-mono">error loading consumables</div>;
  }

  return (
    <div>
      <GroupedList
        items={consumables || []}
        getCategory={(consumable) => consumable.category}
        emptyMessage="no consumables yet. add one below."
        renderItem={(consumable) => (
          <Card
            key={consumable.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="checkbox"
                active={consumable.needed}
                onClick={(e) => handleToggleNeeded(e, consumable)}
              >
                {consumable.needed && <CheckmarkIcon />}
              </Button>
              <span className="text-text lowercase">{consumable.name}</span>
            </div>
          </Card>
        )}
      />

      <Button variant="fab" onClick={() => setShowForm(true)}>+</Button>
      {showForm && <ConsumableForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
