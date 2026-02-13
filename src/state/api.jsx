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
    const [recipesRes, ingredientsRes] = await Promise.all([
      fetch(`${API_BASE}/recipes`),
      fetch(`${API_BASE}/ingredients`),
    ]);
    if (!recipesRes.ok) throw new Error("Failed to fetch recipes");
    if (!ingredientsRes.ok) throw new Error("Failed to fetch ingredients");

    const recipes = await recipesRes.json();
    const ingredients = await ingredientsRes.json();
    const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

    return recipes.map((recipe) => ({
      ...recipe,
      ingredients: (recipe.ingredient_ids || [])
        .map((id) => ingredientMap.get(id))
        .filter(Boolean),
    }));
  },

  async getRecipe(id) {
    const [recipeRes, ingredientsRes] = await Promise.all([
      fetch(`${API_BASE}/recipes/${id}`),
      fetch(`${API_BASE}/ingredients`),
    ]);
    if (!recipeRes.ok) throw new Error("Failed to fetch recipe");
    if (!ingredientsRes.ok) throw new Error("Failed to fetch ingredients");

    const recipe = await recipeRes.json();
    const ingredients = await ingredientsRes.json();
    const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

    return {
      ...recipe,
      ingredients: (recipe.ingredient_ids || [])
        .map((ingId) => ingredientMap.get(ingId))
        .filter(Boolean),
    };
  },

  async createRecipe(recipe) {
    // API expects ingredients as an array of names, not objects
    const payload = {
      name: recipe.name,
      notes: recipe.notes || "",
      ingredients: recipe.ingredients || [],
      sources: recipe.sources || [],
    };

    const res = await fetch(`${API_BASE}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create recipe");
    const createdRecipe = await res.json();

    if (
      !createdRecipe.ingredient_ids ||
      createdRecipe.ingredient_ids.length === 0
    ) {
      return { ...createdRecipe, ingredients: [] };
    }

    const ingredientsRes = await fetch(`${API_BASE}/ingredients`);
    if (!ingredientsRes.ok) throw new Error("Failed to fetch ingredients");
    const allIngredients = await ingredientsRes.json();
    const ingredientMap = new Map(allIngredients.map((i) => [i.id, i]));

    return {
      ...createdRecipe,
      ingredients: createdRecipe.ingredient_ids
        .map((id) => ingredientMap.get(id))
        .filter(Boolean),
    };
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

  async addTagToRecipe({ recipeId, tag }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/tags?tag=${encodeURIComponent(tag)}`,
      { method: "POST" },
    );
    if (!res.ok) throw new Error("Failed to add tag to recipe");
    return res.json();
  },

  async removeTagFromRecipe({ recipeId, tag }) {
    const res = await fetch(
      `${API_BASE}/recipes/${recipeId}/tags?tag=${encodeURIComponent(tag)}`,
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error("Failed to remove tag from recipe");
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
