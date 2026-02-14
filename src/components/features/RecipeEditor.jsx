import MarkdownEditor from "../common/MarkdownEditor.jsx";
import RecipeIngredientList from "./RecipeIngredientList.jsx";
import RecipeSourceCard from "./RecipeSourceCard.jsx";
import RecipeSourceInput from "./RecipeSourceInput.jsx";
import RecipeTag from "./RecipeTag.jsx";
import RecipeTagInput from "./RecipeTagInput.jsx";

const styles = {
  nameContainer: "mb-6",
  nameInput:
    "text-2xl font-normal text-text lowercase bg-transparent focus:outline-none w-full placeholder:text-muted border-b border-transparent focus:border-border transition-colors",
  ingredientsContainer: "mb-8",
  ingredientsTitle:
    "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  sourceContainer: "mb-8",
  sourceTitle: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  sourceList: "space-y-3 mb-3",
  tagContainer: "mb-8",
  tagTitle: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  tagList: "flex flex-wrap gap-2 mb-3",
};

export default function RecipeEditor({
  name,
  onNameChange,
  notes,
  onNotesChange,
  ingredients,
  onIngredientsChange,
  sources = [],
  tags = [],
  onAddSource,
  onRemoveSource,
  onAddTag,
  onRemoveTag,
  mode = "local",
}) {
  return (
    <>
      <section className={styles.nameContainer}>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={(e) => onNameChange(e.target.value.trim())}
          className={styles.nameInput}
          placeholder="recipe name"
        />
      </section>

      {onAddTag && onRemoveTag && (
        <section className={styles.tagContainer}>
          <div className={styles.tagList}>
            {tags.map((tag, index) => (
              <RecipeTag key={index} tag={tag} onRemove={onRemoveTag} />
            ))}
            <RecipeTagInput onAdd={onAddTag} />
          </div>
        </section>
      )}

      <section className={styles.ingredientsContainer}>
        <h3 className={styles.ingredientsTitle}>Ingredients</h3>
        <RecipeIngredientList
          ingredients={ingredients}
          onChange={onIngredientsChange}
          mode={mode}
        />
      </section>

      <MarkdownEditor
        value={notes}
        onChange={onNotesChange}
        placeholder="click to add notes"
        title="Notes"
        rows={4}
      />

      {onAddSource && onRemoveSource && (
        <section className={styles.sourceContainer}>
          <h3 className={styles.sourceTitle}>Sources</h3>
          {sources.length > 0 && (
            <div className={styles.sourceList}>
              {sources.map((source, index) => (
                <RecipeSourceCard
                  key={index}
                  source={source}
                  index={index}
                  onRemoveSource={onRemoveSource}
                />
              ))}
            </div>
          )}
          <RecipeSourceInput onAddSource={onAddSource} />
        </section>
      )}
    </>
  );
}
