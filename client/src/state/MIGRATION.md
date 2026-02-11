# State Management Migration Plan

This document outlines the migration from the old `store/` state management system (useReducer + Context + IndexedDB) to the new `state/` system (TanStack Query with API backend).

## Overview

| Aspect       | Old (`store/`)          | New (`state/`)                  |
| ------------ | ----------------------- | ------------------------------- |
| Pattern      | useReducer + Context    | TanStack Query                  |
| Data Source  | IndexedDB (local-first) | Flask API (server-first)        |
| Persistence  | IndexedDB               | localStorage cache + server     |
| State Access | `useStore()` hook       | Individual query/mutation hooks |

## Prerequisites

Before migrating, ensure:

1. **Install dependencies**:

   ```bash
   npm install @tanstack/react-query @tanstack/react-query-persist-client @tanstack/query-sync-storage-persister
   ```

2. **Backend API is available** at `http://localhost:3001/api` with endpoints:
   - `GET/POST /ingredients`
   - `GET/PATCH/DELETE /ingredients/:id`
   - `GET/POST /recipes`
   - `GET/PATCH/DELETE /recipes/:id`
   - `PUT/DELETE /recipes/:recipeId/ingredients/:ingredientId`

3. **Data migration strategy**: Decide how to handle existing IndexedDB data (export to server, discard, etc.)

## Migration Steps

### Phase 1: Setup Provider (App.jsx)

**Before:**

```jsx
import { StoreProvider, useStore, loadAll, saveState } from "./store";

function App() {
  const handleStateChange = useCallback((state) => {
    saveState(state);
  }, []);

  return (
    <BrowserRouter>
      <StoreProvider onStateChange={handleStateChange}>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}
```

**After:**

```jsx
import { StateProvider } from "./state";

function App() {
  return (
    <BrowserRouter>
      <StateProvider>
        <AppContent />
      </StateProvider>
    </BrowserRouter>
  );
}
```

Remove the `loadAll` hydration logic from `AppContent` - TanStack Query handles data fetching automatically.

### Phase 2: Migrate Components

#### Pattern: Reading State

**Before:**

```jsx
const { state } = useStore();
const items = state.ingredients.filter((i) => i.needed);
```

**After:**

```jsx
const { data: ingredients, isLoading, isError } = useIngredients();
if (isLoading) return <Loading />;
if (isError) return <Error />;
const items = ingredients?.filter((i) => i.needed) || [];
```

#### Pattern: Mutations

**Before:**

```jsx
const { actions } = useStore();
actions.toggleNeeded(id);
actions.addRecipe(name, notes, tags);
```

**After:**

```jsx
const toggleNeeded = useToggleNeeded();
const createRecipe = useCreateRecipe();

toggleNeeded.mutate(ingredient); // Pass full ingredient object
createRecipe.mutate({ name, notes, tags });
```

### Phase 3: Component-by-Component Migration

#### 1. GroceryList.jsx

| Old                             | New                                     |
| ------------------------------- | --------------------------------------- |
| `useStore()`                    | `useIngredients()`, `useToggleNeeded()` |
| `state.ingredients.filter(...)` | `data?.filter(...) \|\| []`             |
| `actions.toggleNeeded(id)`      | `toggleNeeded.mutate(ingredient)`       |

```jsx
// Before
const { state, actions } = useStore();
const neededItems = state.ingredients.filter((i) => i.needed);
// ...
actions.toggleNeeded(ingredient.id);

// After
const { data: ingredients, isLoading } = useIngredients();
const toggleNeeded = useToggleNeeded();
const neededItems = ingredients?.filter((i) => i.needed) || [];
// ...
toggleNeeded.mutate(ingredient);
```

#### 2. IngredientList.jsx

| Old                 | New                                     |
| ------------------- | --------------------------------------- |
| `useStore()`        | `useIngredients()`, `useToggleNeeded()` |
| `state.ingredients` | `data` (from query)                     |

#### 3. IngredientDetail.jsx

| Old                           | New                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `useStore()`                  | `useIngredients()`, `useRecipes()`, `useUpdateIngredient()`, `useDeleteIngredient()` |
| `state.ingredients.find(...)` | `data?.find(...)`                                                                    |
| Recipe lookups via join table | Query returns embedded ingredients                                                   |

#### 4. RecipesPage.jsx

| Old             | New                 |
| --------------- | ------------------- |
| `useStore()`    | `useRecipes()`      |
| `state.recipes` | `data` (from query) |

#### 5. RecipeDetail.jsx

| Old                                 | New                                                                                                                                             |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `useStore()`                        | `useRecipe(id)`, `useUpdateRecipe()`, `useDeleteRecipe()`, `useAddIngredientToRecipe()`, `useRemoveIngredientFromRecipe()`, `useToggleNeeded()` |
| Manual join table lookup            | Recipe includes `ingredients` array from API                                                                                                    |
| `actions.updateRecipe(id, updates)` | `updateRecipe.mutate({ id, ...updates })`                                                                                                       |

**Key change**: The new API returns recipes with embedded ingredients, so no manual join needed:

```jsx
// Before
const recipeIngredientIds = state.recipeIngredients
  .filter((ri) => ri.recipe_id === id)
  .map((ri) => ri.ingredient_id);
const ingredients = state.ingredients.filter((i) =>
  recipeIngredientIds.includes(i.id),
);

// After
const { data: recipe } = useRecipe(id);
const ingredients = recipe?.ingredients || [];
```

#### 6. RecipeEditor.jsx

| Old          | New                                         |
| ------------ | ------------------------------------------- |
| `useStore()` | `useIngredients()`, `useCreateIngredient()` |

#### 7. RecipeForm.jsx

| Old                   | New                     |
| --------------------- | ----------------------- |
| `useStore()`          | `useCreateRecipe()`     |
| `actions.addRecipe()` | `createRecipe.mutate()` |

#### 8. CategoryInput.jsx / TagInput.jsx

| Old          | New                                  |
| ------------ | ------------------------------------ |
| `useStore()` | `useIngredients()` or `useRecipes()` |

### Phase 4: Handle Loading States

The new system requires handling async states. Add loading/error handling:

```jsx
function MyComponent() {
  const { data, isLoading, isError, error } = useIngredients();

  if (isLoading) {
    return <div className="text-muted">loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  // Render with data
}
```

### Phase 5: Remove Old System

After all components are migrated:

1. Delete `client/src/store/` directory
2. Remove `idb` from package.json dependencies:
   ```bash
   npm uninstall idb
   ```
3. Delete the `example_usage.jsx` file from `state/`

## API Differences

### Mutation Function Signatures

| Action          | Old Signature                                           | New Signature                                              |
| --------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| Toggle needed   | `actions.toggleNeeded(id)`                              | `toggleNeeded.mutate(ingredient)`                          |
| Update recipe   | `actions.updateRecipe(id, updates)`                     | `updateRecipe.mutate({ id, ...updates })`                  |
| Add ingredient  | `actions.addIngredient(name, needed, category)`         | `createIngredient.mutate({ name, needed, category })`      |
| Create recipe   | `actions.addRecipe(name, notes, tags)`                  | `createRecipe.mutate({ name, notes, tags })`               |
| Delete          | `actions.deleteRecipe(id)`                              | `deleteRecipe.mutate(id)`                                  |
| Link ingredient | `actions.addIngredientToRecipe(recipeId, ingredientId)` | `addIngredientToRecipe.mutate({ recipeId, ingredientId })` |

### Return Values

Old system actions return the created object synchronously:

```jsx
const recipe = actions.addRecipe(name); // Returns recipe immediately
navigate(`/recipes/${recipe.id}`);
```

New system mutations are async:

```jsx
createRecipe.mutate(
  { name, notes, tags },
  {
    onSuccess: (recipe) => {
      navigate(`/recipes/${recipe.id}`);
    },
  },
);
```

## Files to Migrate

| File                   | Uses Store                 | Complexity |
| ---------------------- | -------------------------- | ---------- |
| `App.jsx`              | Yes (Provider + hydration) | Medium     |
| `GroceryList.jsx`      | Yes                        | Low        |
| `IngredientList.jsx`   | Yes                        | Low        |
| `IngredientDetail.jsx` | Yes                        | Medium     |
| `RecipeDetail.jsx`     | Yes                        | High       |
| `RecipeEditor.jsx`     | Yes                        | Medium     |
| `RecipeForm.jsx`       | Yes                        | Low        |
| `RecipesPage.jsx`      | Yes                        | Low        |
| `CategoryInput.jsx`    | Yes                        | Low        |
| `TagInput.jsx`         | Yes                        | Low        |

## Testing Checklist

After migration, verify:

- [ ] App loads without errors
- [ ] Ingredients list displays
- [ ] Recipes list displays
- [ ] Toggle "needed" works (grocery list updates)
- [ ] Create new ingredient works
- [ ] Create new recipe works
- [ ] Edit recipe name/notes/tags works
- [ ] Add ingredient to recipe works
- [ ] Remove ingredient from recipe works
- [ ] Delete recipe works
- [ ] Delete ingredient works
- [ ] Offline indicator shows correctly
- [ ] Data persists on page refresh (localStorage cache)
- [ ] Data syncs with server when online

## Rollback Plan

If issues arise during migration:

1. Keep `store/` directory until migration is fully tested
2. Can run both systems in parallel during transition
3. Git revert to restore old implementation if needed
