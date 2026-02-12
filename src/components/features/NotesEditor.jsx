import { MarkdownEditor } from "../common/index.jsx";

export default function NotesEditor({
  notes,
  onNotesChange,
  placeholder = "click to add notes",
}) {
  return (
    <MarkdownEditor
      value={notes}
      onChange={onNotesChange}
      placeholder={placeholder}
      title="Notes"
      rows={4}
    />
  );
}
