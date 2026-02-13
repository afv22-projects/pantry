import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEntityMutation } from "./entities.jsx";
import { api } from "../api.jsx";

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
  const { createOptimisticMutation, createDeletionMutation, entityId } =
    useEntityMutation("recipes", id);

  return {
    update: useMutation(
      createOptimisticMutation({
        mutationFn: (updates) => api.updateRecipe({ ...updates, id: entityId }),
        updateCacheFn: (old, updates) => ({ ...old, ...updates }),
      }),
    ),

    delete: useMutation(
      createDeletionMutation({
        deletionFn: () => api.deleteRecipe(entityId),
      }),
    ),

    // Ingredients
    addIngredient: useMutation(
      createOptimisticMutation({
        mutationFn: (ingredientName) =>
          api.addIngredientToRecipe({ recipeId: entityId, ingredientName }),
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
            recipeId: entityId,
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
        mutationFn: (tag) => api.addTagToRecipe({ recipeId: entityId, tag }),
        updateCacheFn: (old, tag) => ({
          ...old,
          tags: [...(old.tags || []), tag],
        }),
      }),
    ),

    removeTag: useMutation(
      createOptimisticMutation({
        mutationFn: (tag) =>
          api.removeTagFromRecipe({ recipeId: entityId, tag }),
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
          api.addSourceToRecipe({ recipeId: entityId, source }),
        updateCacheFn: (old, source) => ({
          ...old,
          sources: [...(old.sources || []), source],
        }),
      }),
    ),

    removeSource: useMutation(
      createOptimisticMutation({
        mutationFn: (source) =>
          api.removeSourceFromRecipe({ recipeId: entityId, source }),
        updateCacheFn: (old, source) => ({
          ...old,
          sources: old.sources?.filter((s) => s !== source),
        }),
      }),
    ),
  };
}
