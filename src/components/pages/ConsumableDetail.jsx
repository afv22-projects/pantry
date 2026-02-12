import { useParams, useNavigate } from "react-router-dom";
import {
  useConsumable,
  useToggleConsumableNeeded,
  useUpdateConsumable,
  useDeleteConsumable,
} from "../../state";
import ConsumableCategoryInput from "../features/ConsumableCategoryInput";
import ItemDetail from "../features/ItemDetail";

export default function ConsumableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: consumable, isLoading } = useConsumable(id);
  const toggleNeeded = useToggleConsumableNeeded();
  const updateConsumable = useUpdateConsumable();
  const deleteConsumable = useDeleteConsumable();

  const handleCategoryChange = (category) => {
    updateConsumable.mutate({ id, category: category.toLowerCase() });
  };

  const handleDelete = () => {
    deleteConsumable.mutate(id, {
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
      onToggleNeeded={() => toggleNeeded.mutate(consumable)}
      onDelete={handleDelete}
    />
  );
}
