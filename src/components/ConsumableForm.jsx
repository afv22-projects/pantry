import { useState } from "react";
import { useCreateConsumable } from "../state/index.js";
import ConsumableCategoryInput from "./ConsumableCategoryInput.jsx";
import { Button } from "./common/index.jsx";

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
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center py-8 px-4 z-50 overflow-y-auto">
      <div className="bg-bg border border-border rounded-lg w-full max-w-lg p-6 mb-8">
        <h2 className="text-xl font-normal text-text mb-6 lowercase">
          new consumable
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm text-muted mb-2 lowercase">
              name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="consumable name"
              className="w-full bg-bg border border-border rounded px-3 py-2 text-text lowercase focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
          </div>

          {/* Category Input */}
          <div className="mb-6">
            <label className="block text-sm text-muted mb-2 lowercase">
              category
            </label>
            <ConsumableCategoryInput value={category} onChange={setCategory} />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!name.trim() || createConsumable.isPending}
              className="flex-1"
            >
              {createConsumable.isPending ? "creating..." : "create consumable"}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
