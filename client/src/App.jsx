import { useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider, useStore } from "./state.jsx";
import { loadAll, saveState } from "./db.js";
import TabBar from "./components/TabBar.jsx";

function RecipesPage() {
  return <div className="text-muted">recipes list placeholder</div>;
}

function RecipeDetailPage() {
  return <div className="text-muted">recipe detail placeholder</div>;
}

function IngredientsPage() {
  return <div className="text-muted">ingredients list placeholder</div>;
}

function IngredientDetailPage() {
  return <div className="text-muted">ingredient detail placeholder</div>;
}

function GroceryPage() {
  return <div className="text-muted">grocery list placeholder</div>;
}

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
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-160 mx-auto px-4">
        <header className="sticky top-0 bg-bg z-10 pt-12 pb-2 border-b border-border">
          <h1 className="text-[28px] font-light tracking-wide mb-5 text-text lowercase">
            pantry
          </h1>
          <TabBar />
        </header>

        <main className="pt-6 pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/ingredients/:id" element={<IngredientDetailPage />} />
            <Route path="/grocery" element={<GroceryPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

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

export default App;
