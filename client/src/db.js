import { openDB } from "idb";

const DB_NAME = "pantry-db";
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("recipes")) {
      db.createObjectStore("recipes", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("ingredients")) {
      db.createObjectStore("ingredients", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("recipeIngredients")) {
      db.createObjectStore("recipeIngredients", {
        keyPath: ["recipe_id", "ingredient_id"],
      });
    }
  },
});

export async function getAll(storeName) {
  const db = await dbPromise;
  return db.getAll(storeName);
}

export async function put(storeName, value) {
  const db = await dbPromise;
  return db.put(storeName, value);
}

export async function del(storeName, key) {
  const db = await dbPromise;
  return db.delete(storeName, key);
}

export async function clear(storeName) {
  const db = await dbPromise;
  return db.clear(storeName);
}

export async function loadAll() {
  const [recipes, ingredients, recipeIngredients] = await Promise.all([
    getAll("recipes"),
    getAll("ingredients"),
    getAll("recipeIngredients"),
  ]);
  return { recipes, ingredients, recipeIngredients };
}

export async function saveState(state) {
  const db = await dbPromise;
  const tx = db.transaction(
    ["recipes", "ingredients", "recipeIngredients"],
    "readwrite",
  );

  await Promise.all([
    tx.objectStore("recipes").clear(),
    tx.objectStore("ingredients").clear(),
    tx.objectStore("recipeIngredients").clear(),
  ]);

  await Promise.all([
    ...state.recipes.map((r) => tx.objectStore("recipes").put(r)),
    ...state.ingredients.map((i) => tx.objectStore("ingredients").put(i)),
    ...state.recipeIngredients.map((ri) =>
      tx.objectStore("recipeIngredients").put(ri),
    ),
  ]);

  await tx.done;
}
