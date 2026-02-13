/**
 * Reusable optimistic update patterns for React Query.
 * These are composable building blocks that make common patterns explicit.
 *
 * Use these utilities directly in useMutation hooks to handle optimistic updates,
 * rollbacks, and cache invalidation in a consistent way.
 */

/**
 * For entities WITHOUT detail queries (list-only updates).
 * If you have both useEntities() and useEntity(id), use optimisticEntityUpdate instead.
 *
 * Updates a single item in a list cache by ID.
 *
 * @param {import('@tanstack/react-query').QueryClient} queryClient - The React Query client
 * @param {Array} listKey - Query key for the list cache (e.g., ['recipes'])
 * @param {number} itemId - ID of the item to update
 * @param {Function} updateFn - Function that receives the old item and returns the updated item
 * @returns {Object} Context object with a rollback function
 *
 * @example
 * useMutation({
 *   mutationFn: api.updateRecipe,
 *   onMutate: async (vars) => {
 *     return await optimisticListUpdate(qc, ['recipes'], vars.id,
 *       (old) => ({ ...old, ...vars })
 *     );
 *   },
 *   onError: (err, vars, ctx) => ctx?.rollback(),
 *   onSettled: () => qc.invalidateQueries({ queryKey: ['recipes'] })
 * })
 */
export async function optimisticListUpdate(
  queryClient,
  listKey,
  itemId,
  updateFn,
) {
  await queryClient.cancelQueries({ queryKey: listKey });

  const previousList = queryClient.getQueryData(listKey);

  queryClient.setQueryData(listKey, (old) =>
    old?.map((item) => (item.id === itemId ? updateFn(item) : item)),
  );

  return {
    rollback: () => {
      if (previousList) {
        queryClient.setQueryData(listKey, previousList);
      }
    },
  };
}

/**
 * For entities WITH detail queries (list + detail updates).
 * This is the most common pattern when you have both useEntities() and useEntity(id).
 *
 * Keeps both list and detail caches in sync when updating an entity.
 *
 * @param {import('@tanstack/react-query').QueryClient} queryClient - The React Query client
 * @param {Array} listKey - Query key for the list cache (e.g., ['recipes'])
 * @param {Array} detailKey - Query key for the detail cache (e.g., ['recipes', 123])
 * @param {number} itemId - ID of the item to update
 * @param {Function} updateFn - Function that receives the old item and returns the updated item
 * @returns {Object} Context object with a rollback function
 *
 * @example
 * useMutation({
 *   mutationFn: api.updateRecipe,
 *   onMutate: async (vars) => {
 *     return await optimisticEntityUpdate(
 *       qc, ['recipes'], ['recipes', 123], 123,
 *       (old) => ({ ...old, ...vars })
 *     );
 *   },
 *   onError: (err, vars, ctx) => ctx?.rollback(),
 *   onSettled: () => qc.invalidateQueries({ queryKey: ['recipes'] })
 * })
 */
export async function optimisticEntityUpdate(
  queryClient,
  listKey,
  detailKey,
  itemId,
  updateFn,
) {
  await queryClient.cancelQueries({ queryKey: listKey });
  await queryClient.cancelQueries({ queryKey: detailKey });

  const previousList = queryClient.getQueryData(listKey);
  const previousDetail = queryClient.getQueryData(detailKey);

  if (previousDetail) queryClient.setQueryData(detailKey, updateFn);
  queryClient.setQueryData(listKey, (old) =>
    old?.map((item) => (item.id === itemId ? updateFn(item) : item)),
  );

  return {
    rollback: () => {
      if (previousList) queryClient.setQueryData(listKey, previousList);
      if (previousDetail) queryClient.setQueryData(detailKey, previousDetail);
    },
  };
}

/**
 * Pattern for optimistic deletion from list and detail caches.
 * Removes the item from the list and clears the detail cache.
 *
 * @param {import('@tanstack/react-query').QueryClient} queryClient - The React Query client
 * @param {Array} listKey - Query key for the list cache (e.g., ['recipes'])
 * @param {Array} detailKey - Query key for the detail cache (e.g., ['recipes', 123])
 * @param {number} itemId - ID of the item to delete
 * @returns {Object} Context object with a rollback function
 *
 * @example
 * useMutation({
 *   mutationFn: () => api.deleteRecipe(123),
 *   onMutate: async () => {
 *     return await optimisticDelete(qc, ['recipes'], ['recipes', 123], 123);
 *   },
 *   onError: (err, vars, ctx) => ctx?.rollback(),
 *   onSettled: () => qc.invalidateQueries({ queryKey: ['recipes'] })
 * })
 */
export async function optimisticDelete(
  queryClient,
  listKey,
  detailKey,
  itemId,
) {
  await queryClient.cancelQueries({ queryKey: listKey });
  await queryClient.cancelQueries({ queryKey: detailKey });

  const previousList = queryClient.getQueryData(listKey);
  const previousDetail = queryClient.getQueryData(detailKey);

  queryClient.setQueryData(listKey, (old) =>
    old?.filter((item) => item.id !== itemId),
  );
  queryClient.removeQueries({ queryKey: detailKey });

  return {
    rollback: () => {
      if (previousList) queryClient.setQueryData(listKey, previousList);
      if (previousDetail) queryClient.setQueryData(detailKey, previousDetail);
    },
  };
}

/**
 * Pattern for optimistic creation with a temporary ID.
 * Adds the new item to the list immediately with a temporary ID until the server responds.
 *
 * Note: Use this when you stay on the list view after creation. If you redirect to a detail
 * page immediately after creating, skip optimistic creation - the detail page will load the
 * real data anyway.
 *
 * @param {import('@tanstack/react-query').QueryClient} queryClient - The React Query client
 * @param {Array} listKey - Query key for the list cache (e.g., ['consumables'])
 * @param {Object} newItem - The new item data to add
 * @returns {Object} Context object with rollback function and previous list
 *
 * @example
 * useMutation({
 *   mutationFn: api.createConsumable,
 *   onMutate: async (newConsumable) => {
 *     return await optimisticCreate(qc, ['consumables'], {
 *       ...newConsumable,
 *       id: `temp-${Date.now()}`,
 *       needed: newConsumable.needed ?? false,
 *     });
 *   },
 *   onError: (err, vars, ctx) => ctx?.rollback(),
 *   onSettled: () => qc.invalidateQueries({ queryKey: ['consumables'] })
 * })
 */
export async function optimisticCreate(queryClient, listKey, newItem) {
  await queryClient.cancelQueries({ queryKey: listKey });

  const previousList = queryClient.getQueryData(listKey);

  queryClient.setQueryData(listKey, (old) => [...(old || []), newItem]);

  return {
    rollback: () => {
      if (previousList) {
        queryClient.setQueryData(listKey, previousList);
      }
    },
  };
}
