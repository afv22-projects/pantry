import { useState } from "react";

const RECIPES = [
  { id: 1, name: "Braised Short Ribs", ingredients: ["short ribs", "red wine", "beef stock", "carrots", "onion", "garlic", "thyme", "tomato paste"], notes: "Low and slow at 325°F for 3 hours. Sear ribs hard before braising." },
  { id: 2, name: "Chicken Tikka Masala", ingredients: ["chicken thighs", "yogurt", "garam masala", "cumin", "canned tomatoes", "heavy cream", "onion", "garlic", "ginger", "cilantro"], notes: "Marinate overnight if possible. Finish with cream off heat." },
  { id: 3, name: "Pasta Aglio e Olio", ingredients: ["spaghetti", "garlic", "red pepper flakes", "olive oil", "parsley", "parmesan"], notes: "Reserve pasta water. The starch is the sauce." },
  { id: 4, name: "French Onion Soup", ingredients: ["onion", "beef stock", "gruyère", "butter", "thyme", "baguette", "dry sherry"], notes: "Caramelize onions for 45+ min. Don't rush it." },
  { id: 5, name: "Black Bean Tacos", ingredients: ["black beans", "corn tortillas", "avocado", "lime", "cilantro", "red onion", "cumin", "cotija cheese"], notes: "Mash half the beans, leave half whole for texture." },
  { id: 6, name: "Miso Salmon", ingredients: ["salmon fillets", "white miso", "mirin", "soy sauce", "rice", "sesame seeds", "scallions"], notes: "Glaze and broil 3-4 min. Watch it closely." },
  { id: 7, name: "Mushroom Risotto", ingredients: ["arborio rice", "mixed mushrooms", "onion", "garlic", "white wine", "parmesan", "butter", "vegetable stock"], notes: "Add stock one ladle at a time. Stir constantly last 5 min." },
  { id: 8, name: "Thai Green Curry", ingredients: ["green curry paste", "coconut milk", "chicken thighs", "thai basil", "fish sauce", "lime", "bell pepper", "bamboo shoots", "rice"], notes: "Bloom curry paste in coconut cream before adding liquid." },
];

function getAllIngredients(recipes) {
  const set = new Set();
  recipes.forEach(r => r.ingredients.forEach(i => set.add(i)));
  return [...set].sort();
}

const ALL_INGREDIENTS = getAllIngredients(RECIPES);

export default function App() {
  const [tab, setTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [needed, setNeeded] = useState(new Set());

  const toggleNeeded = (ing) => {
    setNeeded(prev => {
      const next = new Set(prev);
      next.has(ing) ? next.delete(ing) : next.add(ing);
      return next;
    });
  };

  const groceryList = ALL_INGREDIENTS.filter(i => needed.has(i));

  const recipesUsing = (ingredient) =>
    RECIPES.filter(r => r.ingredients.includes(ingredient));

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Pantry</h1>
        <nav style={styles.nav}>
          {["recipes", "ingredients", "grocery list"].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedRecipe(null); setSelectedIngredient(null); }}
              style={{
                ...styles.tab,
                ...(tab === t ? styles.tabActive : {}),
              }}
            >
              {t}
              {t === "grocery list" && groceryList.length > 0 && (
                <span style={styles.badge}>{groceryList.length}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main style={styles.main}>
        {/* ---- RECIPES TAB ---- */}
        {tab === "recipes" && !selectedRecipe && (
          <div style={styles.grid}>
            {RECIPES.map(r => (
              <button
                key={r.id}
                style={styles.card}
                onClick={() => setSelectedRecipe(r)}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#6b7280"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#282828"}
              >
                <span style={styles.cardName}>{r.name}</span>
                <span style={styles.cardMeta}>{r.ingredients.length} ingredients</span>
              </button>
            ))}
          </div>
        )}

        {tab === "recipes" && selectedRecipe && (
          <div style={styles.detail}>
            <button style={styles.back} onClick={() => setSelectedRecipe(null)}>← back</button>
            <h2 style={styles.detailTitle}>{selectedRecipe.name}</h2>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Ingredients</h3>
              <ul style={styles.ingredientList}>
                {selectedRecipe.ingredients.map(ing => (
                  <li key={ing} style={styles.ingredientRow}>
                    <span style={styles.ingredientName}>{ing}</span>
                    <button
                      style={{
                        ...styles.needBtn,
                        ...(needed.has(ing) ? styles.needBtnActive : {}),
                      }}
                      onClick={() => toggleNeeded(ing)}
                    >
                      {needed.has(ing) ? "needed" : "+ need"}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Notes</h3>
              <p style={styles.notes}>{selectedRecipe.notes}</p>
            </section>
          </div>
        )}

        {/* ---- INGREDIENTS TAB ---- */}
        {tab === "ingredients" && !selectedIngredient && (
          <div style={styles.list}>
            {ALL_INGREDIENTS.map(ing => (
              <div key={ing} style={styles.ingredientItem}>
                <label style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={needed.has(ing)}
                    onChange={() => toggleNeeded(ing)}
                    style={styles.checkbox}
                  />
                  <span style={{
                    ...styles.checkText,
                    ...(needed.has(ing) ? styles.checkTextActive : {}),
                  }}>{ing}</span>
                </label>
                <button
                  style={styles.viewBtn}
                  onClick={() => setSelectedIngredient(ing)}
                >
                  →
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "ingredients" && selectedIngredient && (
          <div style={styles.detail}>
            <button style={styles.back} onClick={() => setSelectedIngredient(null)}>← back</button>
            <h2 style={styles.detailTitle}>{selectedIngredient}</h2>

            <div style={{ marginBottom: 24 }}>
              <button
                style={{
                  ...styles.needBtn,
                  ...(needed.has(selectedIngredient) ? styles.needBtnActive : {}),
                  fontSize: 14,
                  padding: "8px 20px",
                }}
                onClick={() => toggleNeeded(selectedIngredient)}
              >
                {needed.has(selectedIngredient) ? "✓ marked as needed" : "+ mark as needed"}
              </button>
            </div>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Used in</h3>
              <ul style={styles.usedInList}>
                {recipesUsing(selectedIngredient).map(r => (
                  <li key={r.id}>
                    <button
                      style={styles.usedInBtn}
                      onClick={() => { setTab("recipes"); setSelectedIngredient(null); setSelectedRecipe(r); }}
                    >
                      {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* ---- GROCERY LIST TAB ---- */}
        {tab === "grocery list" && (
          <div style={styles.list}>
            {groceryList.length === 0 && (
              <p style={styles.empty}>No items needed. Mark ingredients from recipes or the ingredients tab.</p>
            )}
            {groceryList.map(ing => (
              <div key={ing} style={styles.ingredientItem}>
                <label style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleNeeded(ing)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkTextActive}>{ing}</span>
                </label>
                <button
                  style={styles.removeBtn}
                  onClick={() => toggleNeeded(ing)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#111",
    color: "#e5e5e5",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    maxWidth: 640,
    margin: "0 auto",
    padding: "0 16px",
  },
  header: {
    paddingTop: 48,
    paddingBottom: 8,
    position: "sticky",
    top: 0,
    backgroundColor: "#111",
    zIndex: 10,
    borderBottom: "1px solid #1e1e1e",
  },
  title: {
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: "0.04em",
    margin: "0 0 20px 0",
    color: "#f5f5f5",
    textTransform: "lowercase",
  },
  nav: {
    display: "flex",
    gap: 0,
  },
  tab: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: 13,
    fontFamily: "'DM Mono', 'SF Mono', monospace",
    padding: "10px 16px",
    cursor: "pointer",
    textTransform: "lowercase",
    letterSpacing: "0.03em",
    transition: "color 0.15s",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  tabActive: {
    color: "#f5f5f5",
    borderBottom: "1px solid #f5f5f5",
  },
  badge: {
    backgroundColor: "#d4643b",
    color: "#fff",
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 8,
    padding: "1px 6px",
    lineHeight: "16px",
  },
  main: {
    paddingTop: 24,
    paddingBottom: 80,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  card: {
    background: "#161616",
    border: "1px solid #282828",
    borderRadius: 8,
    padding: "20px 16px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    transition: "border-color 0.15s",
  },
  cardName: {
    fontSize: 15,
    fontWeight: 500,
    color: "#e5e5e5",
    lineHeight: 1.3,
  },
  cardMeta: {
    fontSize: 12,
    color: "#555",
    fontFamily: "'DM Mono', monospace",
  },
  detail: {
    maxWidth: 480,
  },
  back: {
    background: "none",
    border: "none",
    color: "#666",
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer",
    padding: "4px 0",
    marginBottom: 16,
    letterSpacing: "0.02em",
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 400,
    margin: "0 0 28px 0",
    color: "#f5f5f5",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#555",
    marginBottom: 12,
    fontFamily: "'DM Mono', monospace",
  },
  ingredientList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  ingredientRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 6,
    backgroundColor: "#161616",
  },
  ingredientName: {
    fontSize: 14,
    color: "#ccc",
  },
  needBtn: {
    background: "none",
    border: "1px solid #333",
    borderRadius: 4,
    color: "#666",
    fontSize: 11,
    fontFamily: "'DM Mono', monospace",
    padding: "4px 10px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  needBtnActive: {
    borderColor: "#d4643b",
    color: "#d4643b",
  },
  notes: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#999",
    margin: 0,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  ingredientItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 6,
    backgroundColor: "#161616",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    flex: 1,
  },
  checkbox: {
    accentColor: "#d4643b",
    width: 16,
    height: 16,
    cursor: "pointer",
  },
  checkText: {
    fontSize: 14,
    color: "#999",
  },
  checkTextActive: {
    fontSize: 14,
    color: "#e5e5e5",
  },
  viewBtn: {
    background: "none",
    border: "none",
    color: "#444",
    fontSize: 16,
    cursor: "pointer",
    padding: "4px 8px",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#555",
    fontSize: 14,
    cursor: "pointer",
    padding: "4px 8px",
    transition: "color 0.15s",
  },
  usedInList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  usedInBtn: {
    background: "#161616",
    border: "1px solid #282828",
    borderRadius: 6,
    color: "#ccc",
    fontSize: 14,
    padding: "10px 14px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  },
  empty: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    padding: "60px 20px",
    lineHeight: 1.6,
  },
};
