import { useState } from "react";
import { Button } from "./common/index.jsx";

const styles = {
  container: "mb-8",
  title: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  textarea:
    "w-full bg-surface border border-border rounded-lg p-3 text-text text-sm resize-none focus:outline-none focus:border-muted",
  buttons: "flex gap-2 mt-2",
  display:
    "bg-surface rounded-lg p-3 text-sm cursor-pointer hover:border-muted border border-transparent transition-colors",
  text: "text-text whitespace-pre-wrap",
  placeholder: "text-muted font-mono",
};

export default function NotesEditor({
  notes,
  onNotesChange,
  placeholder = "click to add notes",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotes, setEditingNotes] = useState(notes);

  const handleSave = () => {
    onNotesChange(editingNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingNotes(notes);
    setIsEditing(false);
  };

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Notes</h3>
      {isEditing ? (
        <>
          <textarea
            value={editingNotes}
            onChange={(e) => setEditingNotes(e.target.value)}
            className={styles.textarea}
            rows={4}
            placeholder="optional cooking notes"
            autoFocus
          />
          <div className={styles.buttons}>
            <Button variant="primary" size="sm" onClick={handleSave}>
              save
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              cancel
            </Button>
          </div>
        </>
      ) : (
        <div
          onClick={() => {
            setEditingNotes(notes);
            setIsEditing(true);
          }}
          className={styles.display}
        >
          {notes ? (
            <p className={styles.text}>{notes}</p>
          ) : (
            <p className={styles.placeholder}>{placeholder}</p>
          )}
        </div>
      )}
    </section>
  );
}
