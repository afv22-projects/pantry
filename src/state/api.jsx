const API_BASE = "https://the404.marlin-peacock.ts.net:3001/pantry";

export const api = {
  async getIngredients() {
    const res = await fetch(`${API_BASE}/ingredients`);
    if (!res.ok) throw new Error("Failed to fetch ingredients");
    return res.json();
  },

  async getIngredient(id) {
    const res = await fetch(`${API_BASE}/ingredients/${id}`);
    if (!res.ok) throw new Error("Failed to fetch ingredient");
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/ingredients/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
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
    return null;
  },

  async getRecipes() {
    const res = await fetch(`${API_BASE}/recipes`);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const recipes = await res.json();

    // Expand ingredient_ids to full ingredient objects
    const recipesWithIngredients = await Promise.all(
      recipes.map(async (recipe) => {
        if (!recipe.ingredient_ids || recipe.ingredient_ids.length === 0) {
          return { ...recipe, ingredients: [] };
        }

        const ingredients = await Promise.all(
          recipe.ingredient_ids.map((id) => api.getIngredient(id)),
        );

        return { ...recipe, ingredients };
      }),
    );

    return recipesWithIngredients;
  },

  async getRecipe(id) {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch recipe");
    const recipe = await res.json();

    // Expand ingredient_ids to full ingredient objects
    if (!recipe.ingredient_ids || recipe.ingredient_ids.length === 0) {
      return { ...recipe, ingredients: [] };
    }

    const ingredients = await Promise.all(
      recipe.ingredient_ids.map((ingredientId) =>
        api.getIngredient(ingredientId),
      ),
    );

    return { ...recipe, ingredients };
  },

  async createRecipe(recipe) {
    // API expects ingredients as an array of names, not objects
    const payload = {
      name: recipe.name,
      notes: recipe.notes || "",
      ingredients: recipe.ingredients || [],
    };

    const res = await fetch(`${API_BASE}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create recipe");
    const createdRecipe = await res.json();

    // Expand ingredient_ids to full ingredient objects for consistency
    if (
      !createdRecipe.ingredient_ids ||
      createdRecipe.ingredient_ids.length === 0
    ) {
      return { ...createdRecipe, ingredients: [] };
    }

    const ingredients = await Promise.all(
      createdRecipe.ingredient_ids.map((id) => api.getIngredient(id)),
    );

    return { ...createdRecipe, ingredients };
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
    return null;
  },

  async addIngredientToRecipe({ recipeId, ingredientName }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/ingredients?name=${encodeURIComponent(ingredientName)}`,
      { method: "POST" },
    );
    if (!res.ok) throw new Error("Failed to link ingredient to recipe");
    return res.json();
  },

  async removeIngredientFromRecipe({ recipeId, ingredientName }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/ingredients?ingredient=${encodeURIComponent(ingredientName)}`,
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error("Failed to unlink ingredient from recipe");
    return res.json();
  },

  async addSourceToRecipe({ recipeId, source }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/sources?source=${encodeURIComponent(source)}`,
      { method: "POST" },
    );
    if (!res.ok) throw new Error("Failed to add source to recipe");
    return res.json();
  },

  async removeSourceFromRecipe({ recipeId, source }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/sources?source=${encodeURIComponent(source)}`,
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error("Failed to remove source from recipe");
    return null;
  },

  async getConsumables() {
    const res = await fetch(`${API_BASE}/consumables`);
    if (!res.ok) throw new Error("Failed to fetch consumables");
    return res.json();
  },

  async getConsumable(id) {
    const res = await fetch(`${API_BASE}/consumables/${id}`);
    if (!res.ok) throw new Error("Failed to fetch consumable");
    return res.json();
  },

  async getConsumableCategories() {
    const res = await fetch(`${API_BASE}/consumables/categories`);
    if (!res.ok) throw new Error("Failed to fetch consumable categories");
    return res.json();
  },

  async createConsumable(consumable) {
    const res = await fetch(`${API_BASE}/consumables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consumable),
    });
    if (!res.ok) throw new Error("Failed to create consumable");
    return res.json();
  },

  async updateConsumable({ id, ...fields }) {
    const res = await fetch(`${API_BASE}/consumables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("Failed to update consumable");
    return res.json();
  },

  async deleteConsumable(id) {
    const res = await fetch(`${API_BASE}/consumables/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete consumable");
    return null;
  },
};
