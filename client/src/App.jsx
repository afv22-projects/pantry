import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StateProvider } from "./state";
import TabBar from "./components/TabBar.jsx";
import RecipesPage from "./components/RecipesPage.jsx";
import RecipeDetail from "./components/RecipeDetail.jsx";
import IngredientList from "./components/IngredientList.jsx";
import IngredientDetail from "./components/IngredientDetail.jsx";
import GroceryList from "./components/GroceryList.jsx";
import { LogoIcon } from "./components/icons";

function AppContent() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-160 mx-auto px-4">
        <header className="sticky top-0 bg-bg z-10 pt-12 pb-2 border-b border-border">
          <h1 className="text-[28px] font-light tracking-wide mb-5 text-text lowercase flex items-center gap-3">
            <LogoIcon classname="translate-y-1" />
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

// Derive the base path from the URL so the app can be served from any subdirectory
// without knowing the path at build time. When served at example.com/pantry/,
// this returns "/pantry". When served at the root, this returns "".
function getBasePath() {
  const base = new URL(document.baseURI).pathname.replace(/\/+$/, "");
  return base;
}

function App() {
  return (
    <BrowserRouter basename={getBasePath()}>
      <StateProvider>
        <AppContent />
      </StateProvider>
    </BrowserRouter>
  );
}

export default App;
