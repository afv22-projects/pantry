import { useConsumableActions } from "../../state";
import ItemCard from "./ItemCard";

export default function ConsumableCard({ consumable }) {
  const consumableActions = useConsumableActions(consumable.id);

  return (
    <ItemCard
      name={consumable.name}
      needed={consumable.needed}
      onToggle={() => consumableActions.toggleNeeded.mutate()}
      linkTo={`/consumables/${consumable.id}`}
    />
  );
}
