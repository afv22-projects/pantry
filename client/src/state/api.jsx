const API_BASE = "http://localhost:3001/api";

export const api = {
  async getIngredients() {
    const res = await fetch(`${API_BASE}/ingredients`);
    if (!res.ok) throw new Error("Failed to fetch ingredients");
    return res.json();
  },

  async createIngredient(ingredient) {
    const res = await fetch(`${API_BASE}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ingredient),
    });
    if (!res.ok) throw new Error("Failed to create ingredient");
    return res.json();
  },

  async updateIngredient({ id, ...fields }) {
    const res = await fetch(`${API_BASE}/ingredients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("Failed to update ingredient");
    return res.json();
  },

  async deleteIngredient(id) {
    const res = await fetch(`${API_BASE}/ingredients/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete ingredient");
    return res.json();
  },

  async getRecipes() {
    const res = await fetch(`${API_BASE}/recipes`);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    return res.json();
  },

  async getRecipe(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch recipe");
    return res.json();
  },

  async createRecipe(recipe) {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error("Failed to create recipe");
    return res.json();
  },

  async updateRecipe({ id, ...fields }) {
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("Failed to update recipe");
    return res.json();
  },

  async deleteRecipe(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete recipe");
    return res.json();
  },

  async addIngredientToRecipe({ recipeId, ingredientId }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/ingredients/${ingredientId}`,
      { method: "PUT" },
    );
    if (!res.ok) throw new Error("Failed to link ingredient to recipe");
    return res.json();
  },

  async removeIngredientFromRecipe({ recipeId, ingredientId }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/ingredients/${ingredientId}`,
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error("Failed to unlink ingredient from recipe");
    return res.json();
  },
};
