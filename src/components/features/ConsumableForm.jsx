import { useState } from "react";
import { useCreateConsumable } from "../../state/index.js";
import ConsumableCategoryInput from "./ConsumableCategoryInput.jsx";
import { Button, Modal } from "../common/index.jsx";

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

export default function ConsumableForm({ onClose }) {
  const createConsumable = useCreateConsumable();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createConsumable.mutate(
      {
        name: name.trim().toLowerCase(),
        category: category || "other",
        needed: false,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create consumable:", error);
          alert(`Failed to create consumable: ${error.message}`);
        },
      },
    );
  };

  return (
    <Modal title="new consumable" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className={styles.nameContainer}>
          <label className={styles.nameTitle}>name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="consumable name"
            className={styles.nameInput}
            autoFocus
          />
        </div>

        <div className={styles.categoryContainer}>
          <label className={styles.categoryTitle}>category</label>
          <ConsumableCategoryInput value={category} onChange={setCategory} />
        </div>

        <div className={styles.actionsContainer}>
          <Button
            type="submit"
            disabled={!name.trim() || createConsumable.isPending}
            className={styles.submitButton}
          >
            {createConsumable.isPending ? "creating..." : "create consumable"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
