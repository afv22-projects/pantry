import { useParams, useNavigate } from "react-router-dom";
import { useConsumable, useConsumableActions } from "../../state";
import ConsumableCategoryInput from "../features/ConsumableCategoryInput";
import ItemDetail from "../features/ItemDetail";

export default function ConsumableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: consumable, isLoading } = useConsumable(id);
  const consumableActions = useConsumableActions(id);

  const handleCategoryChange = (category) => {
    consumableActions.update.mutate({ category: category.toLowerCase() });
  };

  const handleDelete = () => {
    consumableActions.delete.mutate(undefined, {
      onSuccess: () => navigate("/consumables"),
    });
  };

  return (
    <ItemDetail
      item={consumable}
      itemType="consumable"
      isLoading={isLoading}
      backLink="/consumables"
      categoryInput={
        <ConsumableCategoryInput
          value={consumable?.category || ""}
          onChange={handleCategoryChange}
        />
      }
      onToggleNeeded={consumableActions.toggleNeeded.mutate}
      onDelete={handleDelete}
    />
  );
}
