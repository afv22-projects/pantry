import { Link } from "react-router-dom";
import { Card } from "./common";

export default function RecipeCard({ recipe, ingredientCount }) {
  return (
    <Card as={Link} to={`/recipes/${recipe.id}`} className="p-5">
      <h3 className="text-lg font-normal text-text mb-2 lowercase">
        {recipe.name}
      </h3>
      <p className="text-muted font-mono text-[13px]">
        {ingredientCount} ingredient{ingredientCount !== 1 ? "s" : ""}
      </p>
    </Card>
  );
}
