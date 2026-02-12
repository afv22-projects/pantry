import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

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
