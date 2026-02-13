import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRecipe } from "../../state/index.js";
import RecipeEditor from "./RecipeEditor.jsx";
import { Button, Modal } from "../common/index.jsx";

const styles = {
  buttonGrid: "flex gap-3",
  submitButton: "flex-1",
};

export default function RecipeForm({ onClose }) {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [sources, setSources] = useState([]);
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const recipeDetails = {
      name: name.trim(),
      notes,
      ingredients: ingredients.map((i) => i.name),
      sources,
      tags,
    };

    createRecipe.mutate(recipeDetails, {
      onSuccess: (recipe) => {
        navigate(`/recipes/${recipe.id}`);
        onClose();
      },
    });
  };

  return (
    <Modal title="new recipe" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <RecipeEditor
          name={name}
          onNameChange={setName}
          notes={notes}
          onNotesChange={setNotes}
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          sources={sources}
          tags={tags}
          onAddSource={(source) => setSources([...sources, source])}
          onRemoveSource={(index) =>
            setSources(sources.filter((_, i) => i !== index))
          }
          onAddTag={(tag) => setTags([...tags, tag])}
          onRemoveTag={(index) => setTags(tags.filter((_, i) => i !== index))}
          showNeededIndicator={false}
          namePlaceholder="recipe name"
          isCreateMode={true}
        />

        <div className={styles.buttonGrid}>
          <Button
            type="submit"
            disabled={!name.trim() || createRecipe.isPending}
            className={styles.submitButton}
          >
            {createRecipe.isPending ? "creating..." : "create recipe"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
