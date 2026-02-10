# Pantry — Implementation Plan

## Architecture

```
pantry/
├── client/                  # React + Vite
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx          # Router + tab layout
│   │   ├── state.js         # useReducer + Context (app state)
│   │   ├── db.js            # IndexedDB via idb (offline-first persistence)
│   │   ├── api.js           # Fetch wrapper for Flask endpoints
│   │   ├── sync.js          # Background sync logic
│   │   ├── components/
│   │   │   ├── TabBar.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   ├── IngredientList.jsx
│   │   │   ├── IngredientDetail.jsx
│   │   │   ├── GroceryList.jsx
│   │   │   └── TagFilter.jsx
│   │   └── styles/
│   │       └── index.css     # Tailwind + custom dark theme tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                   # Flask
│   ├── app.py                # Routes + CORS
│   ├── models.py             # SQLAlchemy models
│   ├── schema.sql            # Migration seed
│   └── requirements.txt
│
└── .github/
    └── workflows/
        └── release.yml       # Release-please + build + tarball
```

## Data Model

Four entities. Flat.

```
Recipe
  id          TEXT (uuid)
  name        TEXT
  notes       TEXT
  tags        TEXT (comma-separated, lowercase)
  created_at  TIMESTAMP
  updated_at  TIMESTAMP

Ingredient
  id          TEXT (uuid)
  name        TEXT (unique, case-insensitive)
  needed      BOOLEAN
  updated_at  TIMESTAMP

RecipeIngredient  (join table)
  recipe_id     TEXT → Recipe.id
  ingredient_id TEXT → Ingredient.id

Tag  (derived, not stored separately)
  Computed from unique values across all Recipe.tags fields.
  No dedicated table — tags are just strings on recipes.
```

Ingredients are global and shared across recipes. The `needed` flag lives on the ingredient — toggling it from any surface (recipe detail, ingredient list, grocery list) updates the same record.

Tags are stored as comma-separated lowercase strings on each recipe. The tag list for filtering is derived at read time. No tag management UI — just a text input when editing a recipe.

---

## State Architecture

No external state library. React built-ins only.

```
useReducer + Context at App root
        │
        │  dispatch(action)
        ▼
┌─────────────────┐
│  React State     │  ← in-memory, drives all renders
│  (useReducer)    │
└───────┬──────────┘
        │
        ├──────────────────────┐
        ▼                      ▼
┌──────────────┐      ┌──────────────┐
│  IndexedDB    │      │  Flask API    │
│  (local disk) │      │  (remote)     │
│               │      │               │
│  survives     │      │  survives     │
│  refresh      │      │  everything   │
└──────────────┘      └──────────────┘
```

**Write path:** dispatch → React state updates (instant render) → write to IndexedDB → fire request to Flask (best-effort, queue on failure).

**Read path on load:** hydrate from IndexedDB → render → fetch from Flask in background → merge (newer `updated_at` wins) → update both React state and IndexedDB.

**Hydration:** `App` renders a loading state until IndexedDB read completes, then initializes `useReducer` with the loaded data. No empty-then-patch flicker.

---

## Phases

### Phase 1: Client-only with local storage + CI

Full UI working with no server. All state in React, persisted to IndexedDB.

**Tasks:**

1. **Scaffold project**
   - `npm create vite@latest client -- --template react`
   - Install: `idb`, `tailwindcss`, `react-router-dom`
   - Configure Tailwind with dark-mode class strategy
   - Initialize git repo, push to `afv22-projects/pantry`

2. **CI: release workflow (`.github/workflows/release.yml`)**
   - Uses `afv22-projects/.github/.github/workflows/release-please.yml@main` with `release-type: node`
   - On release created: checkout → setup Node 20 → `npm ci` → `npm run build` → tarball `dist/` → upload to GitHub release
   - Adapted from reflect repo workflow, only change is tarball name (`pantry-{tag}.tar.gz`) and the build output being a Vite `dist/`

3. **State management (`state.jsx`)** ✅
   - `useReducer` with actions: `INIT`, `ADD_RECIPE`, `UPDATE_RECIPE`, `DELETE_RECIPE`, `TOGGLE_NEEDED`, `ADD_INGREDIENT`, `ADD_INGREDIENT_TO_RECIPE`, `REMOVE_INGREDIENT_FROM_RECIPE`
   - `StoreProvider` context wrapper with `onStateChange` callback for persistence
   - Reducer shape: `{ recipes: [], ingredients: [], recipeIngredients: [], loaded: false }`
   - Custom hook `useStore()` returns `{ state, actions }`

4. **IndexedDB layer (`db.js`)** ✅
   - Database: `pantry-db`
   - Object stores: `recipes`, `ingredients`, `recipeIngredients`
   - Expose `getAll`, `put`, `del`, `clear` per store
   - `loadAll()` loads all stores at once for hydration
   - `saveState(state)` persists full state in a single transaction
   - On app init: `loadAll()` → dispatch `INIT` with data
   - On state change: `StoreProvider.onStateChange` callback triggers `saveState()`

5. **Tab layout + routing (`App.jsx`)**
   - Three tabs: `/recipes`, `/ingredients`, `/grocery`
   - Sticky header with tab bar, badge count on grocery tab
   - Routes: `/recipes/:id` for recipe detail, `/ingredients/:id` for ingredient detail

6. **Recipes tab**
   - `RecipeCard.jsx` — name, ingredient count, tags as small pills. Click → detail.
   - `RecipeDetail.jsx` — ingredient list with per-item need toggle, notes (editable textarea), tags (editable)
   - `RecipeForm.jsx` — name field, add ingredients by typing (autocomplete against existing, create new on enter), notes textarea, tags input
   - `TagFilter.jsx` — horizontal scrollable row of tag pills above recipe grid. Click to toggle. Multiple tags = AND filter. "All" pill to clear.
   - Grid layout, 2 columns on mobile, 3 on wider screens

7. **Ingredients tab**
   - `IngredientList.jsx` — alphabetical, checkbox toggles `needed`, click → detail
   - `IngredientDetail.jsx` — need toggle + list of recipes using this ingredient (clickable → recipe)

8. **Grocery List tab**
   - `GroceryList.jsx` — ingredients where `needed === true`
   - Checkbox to un-need, remove button
   - Empty state when list is clear

9. **Styling**
   - Dark theme: bg `#111`, surface `#161616`, border `#282828`, text `#e5e5e5`, accent `#d4643b`
   - Monospace (`DM Mono` or similar) for labels, meta text, tags, tab names
   - All recipe names and ingredient names rendered lowercase
   - Tag pills: small, monospace, border `#333`, lowercase. Active filter uses accent color.
   - Minimal transitions on hover/focus
   - Mobile-first, single-column on small screens

**Exit criteria:** Full CRUD for recipes with tags, tag filtering, ingredient need-toggling from all three surfaces, data survives refresh via IndexedDB. CI pipeline creates releases on merge to main.

---

### Phase 2: Flask server + sync

Flask backend as backup. Client remains primary.

**Tasks:**

10. **Flask app (`app.py`)**
    - Endpoints:
      - `GET /api/recipes` — list all with ingredients joined
      - `POST /api/recipes` — create
      - `PUT /api/recipes/:id` — update (name, notes, tags, ingredient list)
      - `DELETE /api/recipes/:id`
      - `GET /api/ingredients` — list all
      - `PUT /api/ingredients/:id` — update (needed flag)
      - `POST /api/ingredients` — create
    - SQLite via SQLAlchemy
    - CORS for Vite dev server (`localhost:5173`)

11. **Database (`models.py`, `schema.sql`)**
    - SQLAlchemy models matching data model
    - `updated_at` auto-set on mutation
    - SQLite at `server/pantry.db`

12. **API client (`api.js`)**
    - Thin fetch wrapper: `api.get('/recipes')`, `api.put('/ingredients/123', { needed: true })`
    - Base URL from Vite env var

13. **Sync logic (`sync.js`)**
    - Last-write-wins via `updated_at`
    - On load: fetch all from server, merge with IndexedDB (newer wins)
    - On mutation: write IndexedDB immediately, fire-and-forget to server
    - If server unreachable: queue in IndexedDB `pendingSync` store, flush on reconnect or periodic retry
    - No websockets

14. **Vite proxy**
    - Proxy `/api` → `localhost:5000` in `vite.config.js`

**Exit criteria:** App works fully offline. When server runs, data backs up automatically. Fresh browser pulls from server.

---

### Phase 3: Polish

15. **Ingredient autocomplete** — fuzzy match on existing names when adding to recipe. Case-insensitive dedup.

16. **Bulk grocery actions** — "clear all" button.

17. **Keyboard shortcuts** — `/` to filter ingredients, `n` for new recipe.

18. **Import/export** — JSON dump download/upload for all data.

---

## Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| State management | useReducer + Context | App is small, no need for external library |
| Local storage | IndexedDB via `idb` | Structured data, no size limits |
| Sync strategy | Optimistic local-first | Fast UI, server is backup not bottleneck |
| Server DB | SQLite | Single file, no setup, single-user |
| Conflict resolution | Last-write-wins | Simple, predictable for single user |
| Routing | react-router-dom | Standard, clean detail view URLs |
| CSS | Tailwind | Fast dark theme iteration, utility classes |
| Tags | Comma-separated on recipe | No tag management overhead, derived at read time |
| CI | Release-please | Matches existing org workflow pattern |

## Not Doing

- Auth / multi-user
- Recipe steps or cook mode
- Nutritional info
- Meal planning / calendar
- Image uploads
- Tag management UI (tags are just typed in)
