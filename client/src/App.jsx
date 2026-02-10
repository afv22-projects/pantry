import { useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider, useStore, loadAll, saveState } from "./store";
import TabBar from "./components/TabBar.jsx";
import RecipesPage from "./components/RecipesPage.jsx";
import RecipeDetail from "./components/RecipeDetail.jsx";
import IngredientList from "./components/IngredientList.jsx";
import IngredientDetail from "./components/IngredientDetail.jsx";
import GroceryList from "./components/GroceryList.jsx";

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
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/ingredients" element={<IngredientList />} />
            <Route path="/ingredients/:id" element={<IngredientDetail />} />
            <Route path="/grocery" element={<GroceryList />} />
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
