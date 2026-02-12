import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api.jsx";

// ============================================================
// Consumables
// ============================================================

export function useConsumables() {
  return useQuery({
    queryKey: ["consumables"],
    queryFn: api.getConsumables,
  });
}

export function useConsumable(id) {
  return useQuery({
    queryKey: ["consumables", id],
    queryFn: () => api.getConsumable(id),
    enabled: !!id,
  });
}

export function useConsumableCategories() {
  return useQuery({
    queryKey: ["consumableCategories"],
    queryFn: api.getConsumableCategories,
    staleTime: 1000 * 60 * 60, // Categories don't change often, cache for 1 hour
  });
}

export function useToggleConsumableNeeded() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (consumable) =>
      api.updateConsumable({ id: consumable.id, needed: !consumable.needed }),

    onMutate: async (consumable) => {
      await qc.cancelQueries({ queryKey: ["consumables"] });
      const previous = qc.getQueryData(["consumables"]);

      qc.setQueryData(["consumables"], (old) =>
        old?.map((c) =>
          c.id === consumable.id
            ? { ...c, needed: !c.needed }
            : c,
        ),
      );

      return { previous };
    },

    onError: (_err, _item, context) => {
      if (context?.previous) {
        qc.setQueryData(["consumables"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["consumables"] });
    },
  });
}

export function useCreateConsumable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createConsumable,

    onMutate: async (newConsumable) => {
      await qc.cancelQueries({ queryKey: ["consumables"] });
      const previous = qc.getQueryData(["consumables"]);

      qc.setQueryData(["consumables"], (old) => [
        ...(old || []),
        {
          ...newConsumable,
          id: `temp-${Date.now()}`,
          needed: newConsumable.needed ?? false,
        },
      ]);

      return { previous };
    },

    onError: (_err, _item, context) => {
      if (context?.previous) {
        qc.setQueryData(["consumables"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["consumables"] });
    },
  });
}

export function useUpdateConsumable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.updateConsumable,

    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["consumables"] });
      const previous = qc.getQueryData(["consumables"]);

      qc.setQueryData(["consumables"], (old) =>
        old?.map((c) =>
          c.id === updated.id
            ? { ...c, ...updated }
            : c,
        ),
      );

      return { previous };
    },

    onError: (_err, _item, context) => {
      if (context?.previous) {
        qc.setQueryData(["consumables"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["consumables"] });
    },
  });
}

export function useDeleteConsumable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteConsumable,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["consumables"] });
      const previous = qc.getQueryData(["consumables"]);

      qc.setQueryData(["consumables"], (old) =>
        old?.filter((c) => c.id !== id),
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(["consumables"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["consumables"] });
    },
  });
}

// ============================================================
// Ingredients
// ============================================================

export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: api.getIngredients,
  });
}

export function useIngredient(id) {
  return useQuery({
    queryKey: ["ingredients", id],
    queryFn: () => api.getIngredient(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
    staleTime: 1000 * 60 * 60, // Categories don't change often, cache for 1 hour
  });
}

export function useToggleNeeded() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ingredient) =>
      api.updateIngredient({ id: ingredient.id, needed: !ingredient.needed }),

    onMutate: async (ingredient) => {
      await qc.cancelQueries({ queryKey: ["ingredients"] });
      const previous = qc.getQueryData(["ingredients"]);

      qc.setQueryData(["ingredients"], (old) =>
        old?.map((i) =>
          i.id === ingredient.id
            ? { ...i, needed: !i.needed }
            : i,
        ),
      );

      return { previous };
    },

    onError: (_err, _item, context) => {
      if (context?.previous) {
        qc.setQueryData(["ingredients"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["ingredients"] });
      // Also invalidate recipes since they embed ingredient data (including needed status)
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useCreateIngredient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createIngredient,

    onMutate: async (newIngredient) => {
      await qc.cancelQueries({ queryKey: ["ingredients"] });
      const previous = qc.getQueryData(["ingredients"]);

      qc.setQueryData(["ingredients"], (old) => [
        ...(old || []),
        {
          ...newIngredient,
          id: `temp-${Date.now()}`,
          needed: newIngredient.needed ?? false,
        },
      ]);

      return { previous };
    },

    onError: (_err, _item, context) => {
      if (context?.previous) {
        qc.setQueryData(["ingredients"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.updateIngredient,

    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["ingredients"] });
      const previous = qc.getQueryData(["ingredients"]);

      qc.setQueryData(["ingredients"], (old) =>
        old?.map((i) =>
          i.id === updated.id
            ? { ...i, ...updated }
            : i,
        ),
      );

      return { previous };
    },

    onError: (_err, _item, context) => {
      if (context?.previous) {
        qc.setQueryData(["ingredients"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
}

export function useDeleteIngredient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteIngredient,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["ingredients"] });
      const previous = qc.getQueryData(["ingredients"]);

      qc.setQueryData(["ingredients"], (old) =>
        old?.filter((i) => i.id !== id),
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(["ingredients"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["ingredients"] });
      // Also invalidate recipes since they embed ingredients
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

// ============================================================
// Recipes
// ============================================================

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: api.getRecipes,
  });
}

export function useRecipe(id) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => api.getRecipe(id),
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createRecipe,

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.updateRecipe,

    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["recipes"] });
      const previousList = qc.getQueryData(["recipes"]);
      const previousDetail = qc.getQueryData(["recipes", updated.id]);

      qc.setQueryData(["recipes"], (old) =>
        old?.map((r) =>
          r.id === updated.id
            ? { ...r, ...updated }
            : r,
        ),
      );

      if (previousDetail) {
        qc.setQueryData(["recipes", updated.id], (old) => ({
          ...old,
          ...updated,
        }));
      }

      return { previousList, previousDetail };
    },

    onError: (_err, updated, context) => {
      if (context?.previousList) {
        qc.setQueryData(["recipes"], context.previousList);
      }
      if (context?.previousDetail) {
        qc.setQueryData(["recipes", updated.id], context.previousDetail);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteRecipe,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["recipes"] });
      const previous = qc.getQueryData(["recipes"]);

      qc.setQueryData(["recipes"], (old) => old?.filter((r) => r.id !== id));

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(["recipes"], context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

// ============================================================
// Recipe <-> Ingredient join management
// ============================================================

export function useAddIngredientToRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.addIngredientToRecipe,

    onSettled: (_data, _err, { recipeId }) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["recipes", recipeId] });
    },
  });
}

export function useRemoveIngredientFromRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.removeIngredientFromRecipe,

    onMutate: async ({ recipeId, ingredientId }) => {
      await qc.cancelQueries({ queryKey: ["recipes", recipeId] });
      const previous = qc.getQueryData(["recipes", recipeId]);

      qc.setQueryData(["recipes", recipeId], (old) =>
        old
          ? {
              ...old,
              ingredients: old.ingredients?.filter(
                (i) => i.id !== ingredientId,
              ),
            }
          : old,
      );

      return { previous, recipeId };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(["recipes", context.recipeId], context.previous);
      }
    },

    onSettled: (_data, _err, { recipeId }) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["recipes", recipeId] });
    },
  });
}

// ============================================================
// Recipe <-> Source management
// ============================================================

export function useAddSourceToRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.addSourceToRecipe,

    onSettled: (_data, _err, { recipeId }) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["recipes", recipeId] });
    },
  });
}

export function useRemoveSourceFromRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.removeSourceFromRecipe,

    onSettled: (_data, _err, { recipeId }) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["recipes", recipeId] });
    },
  });
}
