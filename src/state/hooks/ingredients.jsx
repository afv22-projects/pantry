import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import {
  optimisticEntityUpdate,
  optimisticDelete,
  optimisticCreate,
  optimisticListUpdate,
} from "./queryUtils.jsx";

export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: api.getIngredients,
  });
}

export function useIngredient(id) {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: api.getIngredients,
    select: (data) => data?.find((i) => i.id === Number(id)),
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

// --- GLOBAL ACTIONS ---

export function useCreateIngredient() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createIngredient,
    onMutate: async (newIngredient) =>
      optimisticCreate(qc, ["ingredients"], {
        ...newIngredient,
        id: `temp-${Date.now()}`,
        needed: newIngredient.needed ?? false,
      }),
    onError: (_err, _vars, ctx) => ctx?.rollback(),
    onSettled: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
}

// --- INDIVIDUAL ACTIONS ---

export function useIngredientActions(id) {
  const qc = useQueryClient();
  const ingredientId = Number(id);
  const listKey = ["ingredients"];
  const detailKey = ["ingredients", ingredientId];

  return {
    update: useMutation({
      mutationFn: (updates) =>
        api.updateIngredient({ ...updates, id: ingredientId }),
      onMutate: async (vars) =>
        optimisticEntityUpdate(qc, listKey, detailKey, ingredientId, (old) => ({
          ...old,
          ...vars,
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    delete: useMutation({
      mutationFn: () => api.deleteIngredient(ingredientId),
      onMutate: async () =>
        optimisticDelete(qc, listKey, detailKey, ingredientId),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => {
        qc.invalidateQueries({ queryKey: listKey });
        // Also invalidate recipes since they embed ingredients
        qc.invalidateQueries({ queryKey: ["recipes"] });
      },
    }),

    toggleNeeded: useMutation({
      mutationFn: (vars) =>
        api.updateIngredient({ id: ingredientId, needed: !vars.needed }),
      onMutate: async (vars) =>
        optimisticEntityUpdate(qc, listKey, detailKey, ingredientId, (old) => ({
          ...old,
          needed: !vars.needed,
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => {
        qc.invalidateQueries({ queryKey: listKey });
        // Also invalidate recipes since they embed ingredient data (including needed status)
        qc.invalidateQueries({ queryKey: ["recipes"] });
      },
    }),
  };
}

// --- BACKWARD COMPATIBILITY ---
// These hooks are kept for backward compatibility with existing code.
// New code should use useIngredientActions(id) instead.

export function useToggleNeeded() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (ingredient) =>
      api.updateIngredient({ id: ingredient.id, needed: !ingredient.needed }),
    onMutate: async (ingredient) =>
      optimisticListUpdate(qc, ["ingredients"], ingredient.id, (old) => ({
        ...old,
        needed: !old.needed,
      })),
    onError: (_err, _vars, ctx) => ctx?.rollback(),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["ingredients"] });
      // Also invalidate recipes since they embed ingredient data (including needed status)
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}
