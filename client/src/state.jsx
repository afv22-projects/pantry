import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useRef,
  useEffect,
} from "react";

const StoreContext = createContext(null);

const initialState = {
  recipes: [],
  ingredients: [],
  recipeIngredients: [],
  loaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        recipes: action.recipes || [],
        ingredients: action.ingredients || [],
        recipeIngredients: action.recipeIngredients || [],
        loaded: true,
      };

    case "ADD_RECIPE":
      return {
        ...state,
        recipes: [...state.recipes, action.recipe],
      };

    case "UPDATE_RECIPE":
      return {
        ...state,
        recipes: state.recipes.map((r) =>
          r.id === action.id
            ? { ...r, ...action.updates, updated_at: action.timestamp }
            : r,
        ),
      };

    case "DELETE_RECIPE":
      return {
        ...state,
        recipes: state.recipes.filter((r) => r.id !== action.id),
        recipeIngredients: state.recipeIngredients.filter(
          (ri) => ri.recipe_id !== action.id,
        ),
      };

    case "TOGGLE_NEEDED":
      return {
        ...state,
        ingredients: state.ingredients.map((i) =>
          i.id === action.id
            ? { ...i, needed: !i.needed, updated_at: action.timestamp }
            : i,
        ),
      };

    case "ADD_INGREDIENT":
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredient],
      };

    case "ADD_INGREDIENT_TO_RECIPE": {
      const exists = state.recipeIngredients.some(
        (ri) =>
          ri.recipe_id === action.recipe_id &&
          ri.ingredient_id === action.ingredient_id,
      );
      if (exists) return state;
      return {
        ...state,
        recipeIngredients: [
          ...state.recipeIngredients,
          { recipe_id: action.recipe_id, ingredient_id: action.ingredient_id },
        ],
      };
    }

    case "REMOVE_INGREDIENT_FROM_RECIPE":
      return {
        ...state,
        recipeIngredients: state.recipeIngredients.filter(
          (ri) =>
            !(
              ri.recipe_id === action.recipe_id &&
              ri.ingredient_id === action.ingredient_id
            ),
        ),
      };

    default:
      return state;
  }
}

function createActions(dispatch, stateRef) {
  return {
    init: (recipes, ingredients, recipeIngredients) =>
      dispatch({ type: "INIT", recipes, ingredients, recipeIngredients }),

    addRecipe: (name, notes = "", tags = "") => {
      const now = new Date().toISOString();
      const recipe = {
        id: crypto.randomUUID(),
        name,
        notes,
        tags,
        created_at: now,
        updated_at: now,
      };
      dispatch({ type: "ADD_RECIPE", recipe });
      return recipe;
    },

    updateRecipe: (id, updates) =>
      dispatch({ type: "UPDATE_RECIPE", id, updates, timestamp: new Date().toISOString() }),

    deleteRecipe: (id) =>
      dispatch({ type: "DELETE_RECIPE", id }),

    toggleNeeded: (id) =>
      dispatch({ type: "TOGGLE_NEEDED", id, timestamp: new Date().toISOString() }),

    // Returns existing ingredient if name matches, otherwise creates new.
    addIngredient: (name, needed = false) => {
      const existing = stateRef.current.ingredients.find(
        (i) => i.name.toLowerCase() === name.toLowerCase(),
      );
      if (existing) return existing;

      const ingredient = {
        id: crypto.randomUUID(),
        name: name.toLowerCase(),
        needed,
        updated_at: new Date().toISOString(),
      };
      dispatch({ type: "ADD_INGREDIENT", ingredient });
      return ingredient;
    },

    addIngredientToRecipe: (recipeId, ingredientId) =>
      dispatch({
        type: "ADD_INGREDIENT_TO_RECIPE",
        recipe_id: recipeId,
        ingredient_id: ingredientId,
      }),

    removeIngredientFromRecipe: (recipeId, ingredientId) =>
      dispatch({
        type: "REMOVE_INGREDIENT_FROM_RECIPE",
        recipe_id: recipeId,
        ingredient_id: ingredientId,
      }),
  };
}

export function StoreProvider({ children, onStateChange }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    if (state.loaded && onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  const actions = useMemo(() => createActions(dispatch, stateRef), []);

  return (
    <StoreContext.Provider value={{ state, actions }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}