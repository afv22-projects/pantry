import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useIngredient,
  useRecipes,
  useToggleNeeded,
  useUpdateIngredient,
  useDeleteIngredient,
} from "../../state";
import CategoryInput from "../features/CategoryInput";
import ItemDetail from "../features/ItemDetail";

export default function IngredientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: ingredient, isLoading: ingredientLoading } = useIngredient(id);
  const { data: recipes, isLoading: recipesLoading } = useRecipes();
  const toggleNeeded = useToggleNeeded();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();

  const recipesUsingIngredient = useMemo(() => {
    if (!ingredient || !recipes) return [];
    // The API returns recipes with embedded ingredients
    // Convert id to number since useParams returns strings
    return recipes.filter((r) =>
      r.ingredients?.some((i) => i.id === Number(id)),
    );
  }, [ingredient, recipes, id]);

  const handleCategoryChange = (category) => {
    updateIngredient.mutate({ id, category: category.toLowerCase() });
  };

  const handleDelete = () => {
    deleteIngredient.mutate(id, {
      onSuccess: () => navigate("/ingredients"),
    });
  };

  return (
    <ItemDetail
      item={ingredient}
      itemType="ingredient"
      isLoading={ingredientLoading || recipesLoading}
      backLink="/ingredients"
      categoryInput={
        <CategoryInput
          value={ingredient?.category || ""}
          onChange={handleCategoryChange}
        />
      }
      relatedItems={{
        title: "Used In",
        emptyMessage: "not used in any recipes yet",
        items: recipesUsingIngredient.map((recipe) => ({
          id: recipe.id,
          name: recipe.name,
          link: `/recipes/${recipe.id}`,
        })),
      }}
      onToggleNeeded={() => toggleNeeded.mutate(ingredient)}
      onDelete={handleDelete}
    />
  );
}
