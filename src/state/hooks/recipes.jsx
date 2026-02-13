import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import { optimisticEntityUpdate, optimisticDelete } from "./queryUtils.jsx";

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
  const qc = useQueryClient();
  const recipeId = Number(id);
  const listKey = ["recipes"];
  const detailKey = ["recipes", recipeId];

  return {
    update: useMutation({
      mutationFn: (updates) => api.updateRecipe({ ...updates, id: recipeId }),
      onMutate: async (vars) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          ...vars,
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    delete: useMutation({
      mutationFn: () => api.deleteRecipe(recipeId),
      onMutate: async () => optimisticDelete(qc, listKey, detailKey, recipeId),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    // Ingredients
    addIngredient: useMutation({
      mutationFn: (ingredientName) =>
        api.addIngredientToRecipe({ recipeId, ingredientName }),
      onMutate: async (name) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          ingredients: [...(old.ingredients || []), { name }],
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    removeIngredient: useMutation({
      mutationFn: (name) =>
        api.removeIngredientFromRecipe({ recipeId, ingredientName: name }),
      onMutate: async (name) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          ingredients: old.ingredients?.filter((i) => i.name !== name),
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    // Tags
    addTag: useMutation({
      mutationFn: (tag) => api.addTagToRecipe({ recipeId, tag }),
      onMutate: async (tag) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          tags: [...(old.tags || []), tag],
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    removeTag: useMutation({
      mutationFn: (tag) => api.removeTagFromRecipe({ recipeId, tag }),
      onMutate: async (tag) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          tags: old.tags?.filter((t) => t !== tag),
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    // Sources
    addSource: useMutation({
      mutationFn: (source) => api.addSourceToRecipe({ recipeId, source }),
      onMutate: async (source) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          sources: [...(old.sources || []), source],
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    removeSource: useMutation({
      mutationFn: (source) => api.removeSourceFromRecipe({ recipeId, source }),
      onMutate: async (source) =>
        optimisticEntityUpdate(qc, listKey, detailKey, recipeId, (old) => ({
          ...old,
          sources: old.sources?.filter((s) => s !== source),
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),
  };
}
