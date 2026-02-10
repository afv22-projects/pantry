import { useEffect, useCallback } from "react";
import { StoreProvider, useStore } from "./state.jsx";
import { loadAll, saveState } from "./db.js";

function AppContent() {
  const { state, actions } = useStore();

  useEffect(() => {
    loadAll().then(({ recipes, ingredients, recipeIngredients }) => {
      actions.init(recipes, ingredients, recipeIngredients);
    });
  }, [actions]);

  if (!state.loaded) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <p className="text-muted font-mono">loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-4">
      <h1 className="text-2xl font-mono text-accent">pantry</h1>
      <p className="mt-2 text-muted">app scaffold ready</p>
    </div>
  );
}

function App() {
  const handleStateChange = useCallback((state) => {
    saveState(state);
  }, []);

  return (
    <StoreProvider onStateChange={handleStateChange}>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
