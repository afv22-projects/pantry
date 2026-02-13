import { useQueryClient } from "@tanstack/react-query";

export function useEntityMutation(baseKey, id) {
  const qc = useQueryClient();
  const entityId = Number(id);
  const listKey = [baseKey];
  const detailKey = [baseKey, entityId];

  const applyOptimistic = async (updateFn) => {
    await qc.cancelQueries({ queryKey: listKey });
    await qc.cancelQueries({ queryKey: detailKey });

    const prevList = qc.getQueryData(listKey);
    const prevDetail = qc.getQueryData(detailKey);

    if (prevDetail) qc.setQueryData(detailKey, (old) => updateFn(old));
    qc.setQueryData(listKey, (old) =>
      old?.map((item) => (item.id === entityId ? updateFn(item) : item)),
    );

    return { prevList, prevDetail };
  };

  const rollback = (context) => {
    if (context?.prevList) qc.setQueryData(listKey, context.prevList);
    if (context?.prevDetail) qc.setQueryData(detailKey, context.prevDetail);
  };

  const settle = () => qc.invalidateQueries({ queryKey: listKey });

  /**
   * Creates a mutation with optimistic updates for entity modifications.
   * @param {Function} params.mutationFn - API call function that performs the mutation (e.g., updateRecipe)
   * @param {Function} params.updateCacheFn - Function that receives (oldEntity, variables) and returns the optimistically updated entity
   * @returns {Object} React Query mutation configuration with optimistic updates
   */
  const createOptimisticMutation = ({ mutationFn, updateCacheFn }) => ({
    mutationFn,
    onMutate: (vars) => {
      applyOptimistic((old) => updateCacheFn(old, vars));
    },
    onError: (_err, _vars, ctx) => rollback(ctx),
    onSettled: settle,
  });

  /**
   * Creates a mutation for entity deletion with optimistic removal from cache.
   * @param {Function} params.deletionFn - API call function that performs the deletion (e.g., deleteRecipe)
   * @returns {Object} React Query mutation configuration with optimistic deletion
   */
  const createDeletionMutation = ({ deletionFn }) => ({
    mutationFn: deletionFn,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: listKey });
      await qc.cancelQueries({ queryKey: detailKey });
      const prev = qc.getQueryData(listKey);
      qc.setQueryData(listKey, (old) =>
        old?.filter((item) => item.id !== entityId),
      );
      qc.removeQueries({ queryKey: detailKey });
      return { prevList: prev };
    },
    onError: (_err, _vars, ctx) => rollback(ctx),
    onSettled: settle,
  });

  return {
    createOptimisticMutation,
    createDeletionMutation,
    entityId,
    listKey,
    rollback,
    settle,
  };
}
