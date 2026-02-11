from datetime import datetime
from typing import Optional
import uuid

from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship

from database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


# SQLAlchemy Models (for database)
recipe_ingredients = Table(
    "recipe_ingredients",
    Base.metadata,
    Column("recipe_id", String, ForeignKey("recipes.id", ondelete="CASCADE"), primary_key=True),
    Column("ingredient_id", String, ForeignKey("ingredients.id", ondelete="CASCADE"), primary_key=True),
)


class IngredientDB(Base):
    __tablename__ = "ingredients"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, nullable=False)
    needed = Column(Boolean, default=False)
    category = Column(String, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recipes = relationship("RecipeDB", secondary=recipe_ingredients, back_populates="ingredients")


class RecipeDB(Base):
    __tablename__ = "recipes"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    notes = Column(String, default="")
    tags = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    ingredients = relationship("IngredientDB", secondary=recipe_ingredients, back_populates="recipes")


# Pydantic Models (for API validation/serialization)
class IngredientBase(BaseModel):
    name: str
    needed: bool = False
    category: str = ""


class IngredientCreate(IngredientBase):
    pass


class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    needed: Optional[bool] = None
    category: Optional[str] = None


class Ingredient(IngredientBase):
    id: str
    updated_at: datetime

    class Config:
        from_attributes = True


class RecipeBase(BaseModel):
    name: str
    notes: str = ""
    tags: str = ""


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None


class Recipe(RecipeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RecipeWithIngredients(Recipe):
    ingredients: list[Ingredient] = []
