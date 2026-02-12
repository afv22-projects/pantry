import { useConsumableCategories } from "../../state";
import Dropdown from "../common/Dropdown";

export default function ConsumableCategoryInput({ value, onChange }) {
  const { data: categories = [] } = useConsumableCategories();

  return (
    <Dropdown
      value={value}
      placeholder="select category..."
      searchPlaceholder="search..."
      options={categories}
      onSelect={(category) => onChange(category.toLowerCase())}
      onClear={() => onChange("")}
      renderValue={(val) => <span className="lowercase">{val}</span>}
      renderOption={(opt) => <span className="lowercase">{opt}</span>}
    />
  );
}
