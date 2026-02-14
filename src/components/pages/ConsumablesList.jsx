import { useState } from "react";
import { useConsumables } from "../../state";
import { Button, GroupedList, Loading, ErrorMessage } from "../common";
import ConsumableForm from "../features/ConsumableForm.jsx";
import ConsumableCard from "../features/ConsumableCard.jsx";

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
        renderItem={(consumable) => (
          <ConsumableCard key={consumable.id} consumable={consumable} />
        )}
      />

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      {showForm && <ConsumableForm onClose={() => setShowForm(false)} />}
    </>
  );
}
