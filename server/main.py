from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from database import Base, engine, get_db
from models import (
    IngredientDB,
    RecipeDB,
    Ingredient,
    IngredientCreate,
    IngredientUpdate,
    RecipeWithIngredients,
    RecipeCreate,
    RecipeUpdate,
    generate_uuid,
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pantry API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Ingredients endpoints
@app.get("/api/ingredients", response_model=list[Ingredient])
def get_ingredients(db: Session = Depends(get_db)):
    return db.query(IngredientDB).all()


@app.post("/api/ingredients", response_model=Ingredient, status_code=201)
def create_ingredient(ingredient: IngredientCreate, db: Session = Depends(get_db)):
    name_lower = ingredient.name.lower()
    existing = db.query(IngredientDB).filter(IngredientDB.name == name_lower).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="Ingredient with this name already exists"
        )

    db_ingredient = IngredientDB(
        id=generate_uuid(),
        name=name_lower,
        needed=ingredient.needed,
        category=ingredient.category.lower(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient


@app.get("/api/ingredients/{ingredient_id}", response_model=Ingredient)
def get_ingredient(ingredient_id: str, db: Session = Depends(get_db)):
    ingredient = db.query(IngredientDB).filter(IngredientDB.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient


@app.patch("/api/ingredients/{ingredient_id}", response_model=Ingredient)
def update_ingredient(
    ingredient_id: str, updates: IngredientUpdate, db: Session = Depends(get_db)
):
    ingredient = db.query(IngredientDB).filter(IngredientDB.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    update_data = updates.model_dump(exclude_unset=True)

    if "name" in update_data:
        update_data["name"] = update_data["name"].lower()
    if "category" in update_data:
        update_data["category"] = update_data["category"].lower()

    for field, value in update_data.items():
        setattr(ingredient, field, value)

    ingredient.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(ingredient)
    return ingredient


@app.delete("/api/ingredients/{ingredient_id}", status_code=204)
def delete_ingredient(ingredient_id: str, db: Session = Depends(get_db)):
    ingredient = db.query(IngredientDB).filter(IngredientDB.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    db.delete(ingredient)
    db.commit()
    return None


# Recipes endpoints
@app.get("/api/recipes", response_model=list[RecipeWithIngredients])
def get_recipes(db: Session = Depends(get_db)):
    return db.query(RecipeDB).all()


@app.post("/api/recipes", response_model=RecipeWithIngredients, status_code=201)
def create_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    db_recipe = RecipeDB(
        id=generate_uuid(),
        name=recipe.name,
        notes=recipe.notes,
        tags=recipe.tags,
        created_at=now,
        updated_at=now,
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@app.get("/api/recipes/{recipe_id}", response_model=RecipeWithIngredients)
def get_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@app.patch("/api/recipes/{recipe_id}", response_model=RecipeWithIngredients)
def update_recipe(
    recipe_id: str, updates: RecipeUpdate, db: Session = Depends(get_db)
):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(recipe, field, value)

    recipe.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(recipe)
    return recipe


@app.delete("/api/recipes/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db.delete(recipe)
    db.commit()
    return None


# Recipe-Ingredient relationship endpoints
@app.put(
    "/api/recipes/{recipe_id}/ingredients/{ingredient_id}",
    response_model=RecipeWithIngredients,
)
def add_ingredient_to_recipe(
    recipe_id: str, ingredient_id: str, db: Session = Depends(get_db)
):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    ingredient = db.query(IngredientDB).filter(IngredientDB.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    if ingredient not in recipe.ingredients:
        recipe.ingredients.append(ingredient)
        db.commit()
        db.refresh(recipe)

    return recipe


@app.delete(
    "/api/recipes/{recipe_id}/ingredients/{ingredient_id}",
    response_model=RecipeWithIngredients,
)
def remove_ingredient_from_recipe(
    recipe_id: str, ingredient_id: str, db: Session = Depends(get_db)
):
    recipe = db.query(RecipeDB).filter(RecipeDB.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    ingredient = db.query(IngredientDB).filter(IngredientDB.id == ingredient_id).first()
    if ingredient and ingredient in recipe.ingredients:
        recipe.ingredients.remove(ingredient)
        db.commit()
        db.refresh(recipe)

    return recipe


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3001)
