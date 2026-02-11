import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useIngredient,
  useRecipes,
  useToggleNeeded,
  useUpdateIngredient,
  useDeleteIngredient,
} from "../state";
import CategoryInput from "./CategoryInput";
import { Button, Card, EmptyState, BackLink } from "./common";

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
      r.ingredients?.some((i) => i.id === Number(id))
    );
  }, [ingredient, recipes, id]);

  if (ingredientLoading || recipesLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (!ingredient) {
    return (
      <div className="text-muted font-mono text-sm">
        ingredient not found.{" "}
        <Link to="/ingredients" className="text-accent hover:underline">
          go back
        </Link>
      </div>
    );
  }

  const handleToggleNeeded = () => {
    toggleNeeded.mutate(ingredient);
  };

  const handleCategoryChange = (category) => {
    updateIngredient.mutate({ id, category: category.toLowerCase() });
  };

  const handleDelete = () => {
    if (window.confirm("delete this ingredient?")) {
      deleteIngredient.mutate(id, {
        onSuccess: () => navigate("/ingredients"),
      });
    }
  };

  return (
    <div>
      <BackLink to="/ingredients" />

      <h2 className="text-2xl font-normal text-text mb-6 lowercase">
        {ingredient.name}
      </h2>

      <Button
        variant="toggle"
        active={ingredient.needed}
        onClick={handleToggleNeeded}
        className="mb-6"
      >
        {ingredient.needed ? "marked as needed" : "+ mark as needed"}
      </Button>

      <section className="mb-8">
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Category
        </h3>
        <CategoryInput
          value={ingredient.category || ""}
          onChange={handleCategoryChange}
        />
      </section>

      <section>
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Used In
        </h3>
        {recipesUsingIngredient.length === 0 ? (
          <EmptyState message="not used in any recipes yet" />
        ) : (
          <div className="space-y-2">
            {recipesUsingIngredient.map((recipe) => (
              <Card key={recipe.id} as={Link} to={`/recipes/${recipe.id}`}>
                <span className="text-text lowercase">{recipe.name}</span>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Button
        variant="danger"
        onClick={handleDelete}
        className="mt-8"
      >
        delete ingredient
      </Button>
    </div>
  );
}
