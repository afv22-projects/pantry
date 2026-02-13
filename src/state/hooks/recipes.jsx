import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import { useEntityMutation } from "./entities.jsx";

// --- QUERIES ---

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: api.getRecipes,
  });
}

export function useRecipe(id) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => api.getRecipe(id),
    placeholderData: () =>
      qc.getQueryData(["recipes"])?.find((r) => r.id === Number(id)),
    enabled: !!id,
  });
}

// --- GLOBAL ACTIONS ---

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createRecipe,
    onSettled: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

// --- INDIVIDUAL ACTIONS ---

export function useRecipeActions(id) {
  const {
    createOptimisticMutation,
    createDeletionMutation,
    entityId: recipeId,
  } = useEntityMutation("recipes", id);

  return {
    update: useMutation(
      createOptimisticMutation({
        mutationFn: (updates) => api.updateRecipe({ ...updates, id: recipeId }),
        updateCacheFn: (old, updates) => ({ ...old, ...updates }),
      }),
    ),

    delete: useMutation(
      createDeletionMutation({
        deletionFn: () => api.deleteRecipe(recipeId),
      }),
    ),

    // Ingredients
    addIngredient: useMutation(
      createOptimisticMutation({
        mutationFn: (ingredientName) =>
          api.addIngredientToRecipe({ recipeId: recipeId, ingredientName }),
        updateCacheFn: (old, name) => ({
          ...old,
          ingredients: [...(old.ingredients || []), { name }],
        }),
      }),
    ),

    removeIngredient: useMutation(
      createOptimisticMutation({
        mutationFn: (name) =>
          api.removeIngredientFromRecipe({
            recipeId: recipeId,
            ingredientName: name,
          }),
        updateCacheFn: (old, name) => ({
          ...old,
          ingredients: old.ingredients?.filter((i) => i.name !== name),
        }),
      }),
    ),

    // Tags
    addTag: useMutation(
      createOptimisticMutation({
        mutationFn: (tag) => api.addTagToRecipe({ recipeId: recipeId, tag }),
        updateCacheFn: (old, tag) => ({
          ...old,
          tags: [...(old.tags || []), tag],
        }),
      }),
    ),

    removeTag: useMutation(
      createOptimisticMutation({
        mutationFn: (tag) =>
          api.removeTagFromRecipe({ recipeId: recipeId, tag }),
        updateCacheFn: (old, tag) => ({
          ...old,
          tags: old.tags?.filter((t) => t !== tag),
        }),
      }),
    ),

    // Sources
    addSource: useMutation(
      createOptimisticMutation({
        mutationFn: (source) =>
          api.addSourceToRecipe({ recipeId: recipeId, source }),
        updateCacheFn: (old, source) => ({
          ...old,
          sources: [...(old.sources || []), source],
        }),
      }),
    ),

    removeSource: useMutation(
      createOptimisticMutation({
        mutationFn: (source) =>
          api.removeSourceFromRecipe({ recipeId: recipeId, source }),
        updateCacheFn: (old, source) => ({
          ...old,
          sources: old.sources?.filter((s) => s !== source),
        }),
      }),
    ),
  };
}
