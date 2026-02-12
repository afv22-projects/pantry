import { Link } from "react-router-dom";
import { Card } from "../common";

const styles = {
  card: "p-5",
  name: "text-lg font-normal text-text mb-2 lowercase",
  ingredients: "text-muted font-mono text-[13px]",
};

export default function RecipeCard({ recipe, ingredientCount }) {
  return (
    <Card as={Link} to={`/recipes/${recipe.id}`} className={styles.card}>
      <h3 className={styles.name}>{recipe.name}</h3>
      <p className={styles.ingredients}>
        {ingredientCount} ingredient{ingredientCount !== 1 ? "s" : ""}
      </p>
    </Card>
  );
}
