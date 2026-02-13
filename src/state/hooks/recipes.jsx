import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const qc = useQueryClient();
  const recipeId = Number(id);
  const listKey = ["recipes"];
  const detailKey = [...listKey, id];

  // Helper to apply optimistic updates to both the list and detail cache
  const applyOptimistic = async (updateFn) => {
    await qc.cancelQueries({ queryKey: listKey });
    await qc.cancelQueries({ queryKey: detailKey });

    const prevList = qc.getQueryData(listKey);
    const prevDetail = qc.getQueryData(detailKey);

    if (prevDetail) qc.setQueryData(detailKey, (old) => updateFn(old));
    qc.setQueryData(listKey, (old) =>
      old?.map((r) => (r.id === recipeId ? updateFn(r) : r)),
    );

    return { prevList, prevDetail };
  };

  const rollback = (context) => {
    if (context?.prevList) qc.setQueryData(listKey, context.prevList);
    if (context?.prevDetail) qc.setQueryData(detailKey, context.prevDetail);
  };

  const settle = () => qc.invalidateQueries({ queryKey: listKey });

  return {
    update: useMutation({
      mutationFn: (updates) => api.updateRecipe({ ...updates, id: recipeId }),
      onMutate: (updates) => applyOptimistic((old) => ({ ...old, ...updates })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    delete: useMutation({
      mutationFn: () => api.deleteRecipe(recipeId),
      onMutate: async () => {
        await qc.cancelQueries({ queryKey: listKey });
        const prev = qc.getQueryData(listKey);
        qc.setQueryData(listKey, (old) =>
          old?.filter((r) => r.id !== recipeId),
        );
        return { prevList: prev };
      },
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    // 3. Ingredients
    addIngredient: useMutation({
      mutationFn: (name) => api.addIngredientToRecipe({ recipeId, name }),
      onMutate: (name) =>
        applyOptimistic((old) => ({
          ...old,
          ingredients: [...(old.ingredients || []), { name }],
        })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    removeIngredient: useMutation({
      mutationFn: (name) =>
        api.removeIngredientFromRecipe({ recipeId, ingredientName: name }),
      onMutate: (name) =>
        applyOptimistic((old) => ({
          ...old,
          ingredients: old.ingredients?.filter((i) => i.name !== name),
        })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    // 4. Tags
    addTag: useMutation({
      mutationFn: (tag) => api.addTagToRecipe({ recipeId, tag }),
      onMutate: (tag) =>
        applyOptimistic((old) => ({
          ...old,
          tags: [...(old.tags || []), tag],
        })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    removeTag: useMutation({
      mutationFn: (tag) => api.removeTagFromRecipe({ recipeId, tag }),
      onMutate: (tag) =>
        applyOptimistic((old) => ({
          ...old,
          tags: old.tags?.filter((t) => t !== tag),
        })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    // 5. Sources
    addSource: useMutation({
      mutationFn: (source) => api.addSourceToRecipe({ recipeId, source }),
      onMutate: (source) =>
        applyOptimistic((old) => ({
          ...old,
          sources: [...(old.sources || []), source],
        })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    removeSource: useMutation({
      mutationFn: (source) => api.removeSourceFromRecipe({ recipeId, source }),
      onMutate: (source) =>
        applyOptimistic((old) => ({
          ...old,
          sources: old.sources?.filter((s) => s !== source),
        })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),
  };
}
