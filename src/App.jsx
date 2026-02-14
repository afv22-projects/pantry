import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StateProvider } from "./state/index.js";
import TabBar from "./components/features/TabBar.jsx";
import RecipesPage from "./components/pages/RecipesPage.jsx";
import RecipeDetail from "./components/pages/RecipeDetail.jsx";
import IngredientsList from "./components/pages/IngredientsList.jsx";
import IngredientDetail from "./components/pages/IngredientDetail.jsx";
import ConsumablesList from "./components/pages/ConsumablesList.jsx";
import ConsumableDetail from "./components/pages/ConsumableDetail.jsx";
import GroceryList from "./components/pages/GroceryList.jsx";
import { LogoIcon } from "./components/icons/index.jsx";

const styles = {
  page: "min-h-screen bg-bg text-text",
  contentContainer: "max-w-160 mx-auto px-4",
  header: "sticky top-0 bg-bg z-10 pt-12 pb-2 border-b border-border",
  title:
    "text-[28px] font-light tracking-wide mb-5 text-text lowercase flex items-center gap-3",
  logoIcon: "translate-y-1",
  main: "pt-6 pb-20",
};

function AppContent() {
  return (
    <div className={styles.page}>
      <div className={styles.contentContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <LogoIcon classname={styles.logoIcon} />
            pantry
          </h1>
          <TabBar />
        </header>

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/ingredients" element={<IngredientsList />} />
            <Route path="/ingredients/:id" element={<IngredientDetail />} />
            <Route path="/consumables" element={<ConsumablesList />} />
            <Route path="/consumables/:id" element={<ConsumableDetail />} />
            <Route path="/grocery" element={<GroceryList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Derive the base path from the URL so the app can be served from any subdirectory
// without knowing the path at build time. When served at example.com/pantry/,
// this returns "/pantry". When served at the root, this returns an empty string.
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
