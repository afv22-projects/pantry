import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

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
