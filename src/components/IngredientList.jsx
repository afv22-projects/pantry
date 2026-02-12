import { useState } from "react";
import { Link } from "react-router-dom";
import { useIngredients, useToggleNeeded } from "../state";
import { Button, Card, Loading, GroupedList, ErrorMessage } from "./common";
import { CheckmarkIcon } from "./icons";
import IngredientForm from "./IngredientForm.jsx";

const styles = {
  card: "flex items-center justify-between",
  cardContent: "flex items-center gap-3",
  cardName: "text-text lowercase",
  cardArrow: "text-muted",
};

export default function IngredientList() {
  const { data: ingredients, isLoading, isError } = useIngredients();
  const toggleNeeded = useToggleNeeded();
  const [showForm, setShowForm] = useState(false);

  const handleToggleNeeded = (e, ingredient) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNeeded.mutate(ingredient);
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage>error loading ingredients</ErrorMessage>;

  return (
    <>
      <GroupedList
        items={ingredients || []}
        getCategory={(ingredient) => ingredient.category}
        emptyMessage="no ingredients yet. add one below."
        renderItem={(ingredient) => (
          <Card
            key={ingredient.id}
            as={Link}
            to={`/ingredients/${ingredient.id}`}
            className={styles.card}
          >
            <div className={styles.cardContent}>
              <Button
                variant="checkbox"
                active={ingredient.needed}
                onClick={(e) => handleToggleNeeded(e, ingredient)}
              >
                {ingredient.needed && <CheckmarkIcon />}
              </Button>
              <span className={styles.cardName}>{ingredient.name}</span>
            </div>
            <span className={styles.cardArrow}>&rarr;</span>
          </Card>
        )}
      />

      <Button variant="fab" onClick={() => setShowForm(true)}>
        +
      </Button>
      {showForm && <IngredientForm onClose={() => setShowForm(false)} />}
    </>
  );
}
