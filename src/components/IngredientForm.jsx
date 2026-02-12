import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateIngredient } from "../state/index.js";
import CategoryInput from "./CategoryInput.jsx";
import { Button, Modal } from "./common/index.jsx";

const styles = {
  nameContainer: "mb-4",
  nameTitle: "block text-sm text-muted mb-2 lowercase",
  nameInput:
    "w-full bg-bg border border-border rounded px-3 py-2 text-text lowercase focus:outline-none focus:ring-2 focus:ring-accent",
  categoryContainer: "mb-6",
  categoryTitle: "block text-sm text-muted mb-2 lowercase",
  actionsContainer: "flex gap-3",
  submitButton: "flex-1",
};

export default function IngredientForm({ onClose }) {
  const navigate = useNavigate();
  const createIngredient = useCreateIngredient();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createIngredient.mutate(
      {
        name: name.trim().toLowerCase(),
        category: category || "other",
        needed: false,
      },
      {
        onSuccess: (ingredient) => {
          navigate(`/ingredients/${ingredient.id}`);
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create ingredient:", error);
          alert(`Failed to create ingredient: ${error.message}`);
        },
      },
    );
  };

  return (
    <Modal title="new ingredient" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.nameContainer}>
          <label className={styles.nameTitle}>name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ingredient name"
            className={styles.nameInput}
            autoFocus
          />
        </div>

        <div className={styles.categoryContainer}>
          <label className={styles.categoryTitle}>category</label>
          <CategoryInput value={category} onChange={setCategory} />
        </div>

        <div className={styles.actionsContainer}>
          <Button
            type="submit"
            disabled={!name.trim() || createIngredient.isPending}
            className={styles.submitButton}
          >
            {createIngredient.isPending ? "creating..." : "create ingredient"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
