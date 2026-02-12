import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

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

export function useAddIngredientToRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.addIngredientToRecipe,

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useRemoveIngredientFromRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.removeIngredientFromRecipe,

    onMutate: async ({ recipeId, ingredientName }) => {
      await qc.cancelQueries({ queryKey: ["recipes", recipeId] });
      const previous = qc.getQueryData(["recipes", recipeId]);

      qc.setQueryData(["recipes", recipeId], (old) =>
        old
          ? {
              ...old,
              ingredients: old.ingredients?.filter(
                (i) => i.name !== ingredientName,
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

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useAddSourceToRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.addSourceToRecipe,

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useRemoveSourceFromRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.removeSourceFromRecipe,

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}
