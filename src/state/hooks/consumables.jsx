import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

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
  const qc = useQueryClient();
  const consumableId = Number(id);
  const listKey = ["consumables"];
  const detailKey = [...listKey, id];

  const applyOptimistic = async (updateFn) => {
    await qc.cancelQueries({ queryKey: detailKey });

    const prevList = qc.getQueryData(listKey);
    const prevDetail = qc.getQueryData(detailKey);

    if (prevDetail) qc.setQueryData(detailKey, (old) => updateFn(old));
    qc.setQueryData(listKey, (old) =>
      old?.map((c) => (c.id === consumableId ? updateFn(c) : c)),
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
      mutationFn: (updates) =>
        api.updateConsumable({ ...updates, id: consumableId }),
      onMutate: async (updates) =>
        applyOptimistic((old) => ({ ...old, ...updates })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    delete: useMutation({
      mutationFn: () => api.deleteConsumable(consumableId),
      onMutate: async () => {
        await qc.cancelQueries({ queryKey: listKey });
        const prev = qc.getQueryData(listKey);
        qc.setQueryData(listKey, (old) =>
          old?.filter((c) => c.id !== consumableId),
        );
        return { prevList: prev };
      },
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),

    toggleNeeded: useMutation({
      mutationFn: (updates) =>
        api.updateConsumable({ id: consumableId, needed: !updates.needed }),
      onMutate: async (updates) =>
        applyOptimistic((old) => ({ ...old, needed: !old.needed })),
      onError: (_err, _vars, ctx) => rollback(ctx),
      onSettled: settle,
    }),
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
