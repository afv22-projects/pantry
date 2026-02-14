import { useState } from "react";
import { useIngredients } from "../../state/index.js";
import { Button, GroupedList, Loading, ErrorMessage } from "../common/index.jsx";
import IngredientForm from "../features/IngredientForm.jsx";
import IngredientCard from "../features/IngredientCard.jsx";

export default function IngredientsList() {
  const { data: ingredients, isLoading, isError } = useIngredients();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage>error loading ingredients</ErrorMessage>;

  return (
    <>
      <GroupedList
        items={ingredients || []}
        getCategory={(ingredient) => ingredient.category}
        emptyMessage="no ingredients yet. add one below."
        renderItem={(ingredient) => <IngredientCard ingredient={ingredient} />}
      />

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      {showForm && <IngredientForm onClose={() => setShowForm(false)} />}
    </>
  );
}
