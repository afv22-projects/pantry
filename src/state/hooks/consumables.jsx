import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import {
  optimisticEntityUpdate,
  optimisticDelete,
  optimisticCreate,
} from "./queryUtils.jsx";

// --- QUERIES ---

export function useConsumables() {
  return useQuery({
    queryKey: ["consumables"],
    queryFn: api.getConsumables,
  });
}

export function useConsumable(id) {
  return useQuery({
    queryKey: ["consumables"],
    queryFn: api.getConsumables,
    select: (data) => data?.find((c) => c.id === Number(id)),
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

// --- GLOBAL ACTIONS ---

export function useCreateConsumable() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createConsumable,
    onMutate: async (newConsumable) =>
      optimisticCreate(qc, ["consumables"], {
        ...newConsumable,
        id: `temp-${Date.now()}`,
        needed: newConsumable.needed ?? false,
      }),
    onError: (_err, _vars, ctx) => ctx?.rollback(),
    onSettled: () => qc.invalidateQueries({ queryKey: ["consumables"] }),
  });
}

// --- INDIVIDUAL ACTIONS ---

export function useConsumableActions(id) {
  const qc = useQueryClient();
  const consumableId = Number(id);
  const listKey = ["consumables"];
  const detailKey = ["consumables", consumableId];

  return {
    update: useMutation({
      mutationFn: (updates) =>
        api.updateConsumable({ ...updates, id: consumableId }),
      onMutate: async (vars) =>
        optimisticEntityUpdate(qc, listKey, detailKey, consumableId, (old) => ({
          ...old,
          ...vars,
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    delete: useMutation({
      mutationFn: () => api.deleteConsumable(consumableId),
      onMutate: async () =>
        optimisticDelete(qc, listKey, detailKey, consumableId),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),

    toggleNeeded: useMutation({
      mutationFn: (updates) =>
        api.updateConsumable({ id: consumableId, needed: !updates.needed }),
      onMutate: async (vars) =>
        optimisticEntityUpdate(qc, listKey, detailKey, consumableId, (old) => ({
          ...old,
          needed: !vars.needed,
        })),
      onError: (_err, _vars, ctx) => ctx?.rollback(),
      onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
    }),
  };
}
