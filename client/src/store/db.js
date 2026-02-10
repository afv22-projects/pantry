import { openDB } from "idb";

const DB_NAME = "pantry-db";
const DB_VERSION = 2;

let dbPromise = null;
let dbUnavailable = false;

function getDB() {
  if (dbUnavailable) {
    return Promise.reject(new Error("IndexedDB is not available"));
  }
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, _newVersion, transaction) {
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

      // Migration: Add category field to existing ingredients
      if (oldVersion < 2) {
        const ingredientStore = transaction.objectStore("ingredients");
        ingredientStore.openCursor().then(function migrateCursor(cursor) {
          if (!cursor) return;
          const ingredient = cursor.value;
          if (ingredient.category === undefined) {
            ingredient.category = "";
            cursor.update(ingredient);
          }
          return cursor.continue().then(migrateCursor);
        });
      }
    },
  }).catch((error) => {
    console.error("Failed to open IndexedDB:", error);
    dbUnavailable = true;
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}

export async function getAll(storeName) {
  try {
    const db = await getDB();
    return db.getAll(storeName);
  } catch (error) {
    console.error(`Failed to get all from ${storeName}:`, error);
    return [];
  }
}

export async function put(storeName, value) {
  try {
    const db = await getDB();
    return db.put(storeName, value);
  } catch (error) {
    console.error(`Failed to put to ${storeName}:`, error);
  }
}

export async function del(storeName, key) {
  try {
    const db = await getDB();
    return db.delete(storeName, key);
  } catch (error) {
    console.error(`Failed to delete from ${storeName}:`, error);
  }
}

export async function clear(storeName) {
  try {
    const db = await getDB();
    return db.clear(storeName);
  } catch (error) {
    console.error(`Failed to clear ${storeName}:`, error);
  }
}

export async function loadAll() {
  try {
    const [recipes, ingredients, recipeIngredients] = await Promise.all([
      getAll("recipes"),
      getAll("ingredients"),
      getAll("recipeIngredients"),
    ]);
    return { recipes, ingredients, recipeIngredients };
  } catch (error) {
    console.error("Failed to load data:", error);
    return { recipes: [], ingredients: [], recipeIngredients: [] };
  }
}

export async function saveState(state) {
  try {
    const db = await getDB();
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
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}
