import { useState } from "react";
import { onlineManager } from "@tanstack/react-query";
import StateProvider from "./provider.jsx";
import { useIngredients, useToggleNeeded, useCreateIngredient } from "./hooks.jsx";

// ============================================================
// Data models (for reference — these match your server schema)
// ============================================================
// Ingredient: { id: UUID, name: str, needed: bool, category: str, updated_at: timestamp }
// Recipe:     { id: UUID, name: str, notes: str, tags: str, created_at: timestamp, updated_at: timestamp }
// RecipeIngredient (join): { recipe_id: UUID, ingredient_id: UUID }
//
// API responses for recipes include their ingredients:
// Recipe { ...fields, ingredients: Ingredient[] }

// ============================================================
// Demo App component — replace with your real UI
// ============================================================
function GroceryList() {
  const { data: ingredients, isLoading, isError, error } = useIngredients();
  const toggleNeeded = useToggleNeeded();
  const addIngredient = useCreateIngredient();
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const isOnline = onlineManager.isOnline();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const neededItems = ingredients?.filter((i) => i.needed) || [];
  const categories = [...new Set(neededItems.map((i) => i.category))].sort();

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h1>Shopping List</h1>

      <p style={{ color: isOnline ? "#4caf50" : "#ff9800", fontSize: 14 }}>
        {isOnline ? "● Online" : "● Offline — changes will sync later"}
      </p>

      {/* Add ingredient */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Ingredient name"
          style={{ flex: 2, padding: 8 }}
        />
        <input
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          placeholder="Category"
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={() => {
            if (newItemName.trim()) {
              addIngredient.mutate({
                name: newItemName.trim(),
                category: newItemCategory.trim() || "Uncategorized",
                needed: true,
              });
              setNewItemName("");
              setNewItemCategory("");
            }
          }}
          style={{ padding: "8px 16px" }}
        >
          Add
        </button>
      </div>

      {/* Grouped by category */}
      {categories.map((category) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <h3
            style={{ fontSize: 14, color: "#888", textTransform: "uppercase" }}
          >
            {category}
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {neededItems
              .filter((i) => i.category === category)
              .map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleNeeded.mutate(item)}
                  />
                  <span style={{ flex: 1 }}>{item.name}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}

      {neededItems.length === 0 && (
        <p style={{ color: "#999" }}>
          No items needed. Add ingredients or select a recipe.
        </p>
      )}
    </div>
  );
}

// ============================================================
// App wrapper with providers
// ============================================================
export default function App() {
  return (
    <StateProvider>
      <GroceryList />
    </StateProvider>
  );
}
