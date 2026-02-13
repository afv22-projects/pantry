import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import { useEntityMutation } from "./entities.jsx";

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

// --- INDIVIDUAL ACTIONS ---

export function useConsumableActions(id) {
  const {
    createOptimisticMutation,
    createDeletionMutation,
    entityId: consumableId,
  } = useEntityMutation("consumables", id);

  return {
    update: useMutation(
      createOptimisticMutation({
        mutationFn: (updates) =>
          api.updateConsumable({ ...updates, id: consumableId }),
        updateCacheFn: (old, updates) => ({ ...old, ...updates }),
      }),
    ),

    delete: useMutation(
      createDeletionMutation({
        deletionFn: () => api.deleteConsumable(consumableId),
      }),
    ),

    toggleNeeded: useMutation(
      createOptimisticMutation({
        mutationFn: (updates) =>
          api.updateConsumable({ id: consumableId, needed: !updates.needed }),
        updateCacheFn: (old, updates) => ({ ...old, needed: !updates.needed }),
      }),
    ),
  };
}

// Can't migrate this yet due to ambiguous items in the Grocery List
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
          c.id === consumable.id ? { ...c, needed: !c.needed } : c,
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
