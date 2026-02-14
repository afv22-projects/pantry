import { useConsumableActions } from "../../state";
import ItemCard from "./ItemCard";

export default function ConsumableCard({ consumable, linkTo = null }) {
  const consumableActions = useConsumableActions(consumable.id);

  return (
    <ItemCard
      name={consumable.name}
      needed={consumable.needed}
      onToggle={() =>
        consumableActions.update.mutate({ needed: !consumable.needed })
      }
      linkTo={linkTo}
    />
  );
}
