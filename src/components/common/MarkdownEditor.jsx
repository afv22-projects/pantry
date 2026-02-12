import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";

const styles = {
  container: "mb-8",
  title: "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  textarea:
    "w-full bg-surface border border-border rounded-lg p-3 text-text text-sm resize-none focus:outline-none focus:border-muted",
  display:
    "bg-surface rounded-lg p-3 text-sm cursor-pointer hover:border-muted border border-transparent transition-colors min-h-[100px]",
  placeholder: "text-muted font-mono",
  markdownContent: "text-text",
};

const markdownComponents = {
  h1: ({ children }) => (
    <h1
      style={{
        fontSize: "2em",
        fontWeight: "bold",
        marginTop: "0.67em",
        marginBottom: "0.67em",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        fontSize: "1.5em",
        fontWeight: "bold",
        marginTop: "0.83em",
        marginBottom: "0.83em",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontSize: "1.17em",
        fontWeight: "bold",
        marginTop: "1em",
        marginBottom: "1em",
      }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      style={{
        fontSize: "1em",
        fontWeight: "bold",
        marginTop: "1.33em",
        marginBottom: "1.33em",
      }}
    >
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5
      style={{
        fontSize: "0.83em",
        fontWeight: "bold",
        marginTop: "1.67em",
        marginBottom: "1.67em",
      }}
    >
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6
      style={{
        fontSize: "0.67em",
        fontWeight: "bold",
        marginTop: "2.33em",
        marginBottom: "2.33em",
      }}
    >
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        marginTop: "0.5em",
        marginBottom: "0.5em",
        paddingLeft: "1.5em",
        listStyleType: "disc",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        marginTop: "0.5em",
        marginBottom: "0.5em",
        paddingLeft: "1.5em",
        listStyleType: "decimal",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ marginTop: "0.25em", marginBottom: "0.25em" }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: "bold" }}>{children}</strong>
  ),
  em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
  code: ({ children, inline }) =>
    inline ? (
      <code
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          padding: "0.2em 0.4em",
          borderRadius: "3px",
          fontFamily: "monospace",
          fontSize: "0.9em",
        }}
      >
        {children}
      </code>
    ) : (
      <code style={{ fontFamily: "monospace" }}>{children}</code>
    ),
  pre: ({ children }) => (
    <pre
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        padding: "0.75em",
        borderRadius: "4px",
        overflowX: "auto",
        marginTop: "0.5em",
        marginBottom: "0.5em",
      }}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "3px solid currentColor",
        paddingLeft: "1em",
        marginLeft: "0",
        marginTop: "0.5em",
        marginBottom: "0.5em",
        opacity: "0.7",
      }}
    >
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      style={{ color: "inherit", textDecoration: "underline", opacity: "0.8" }}
    >
      {children}
    </a>
  ),
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  title,
  rows = 4,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(value);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(editingValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleSave();
    }
  };

  const handleClickOutside = (e) => {
    if (textareaRef.current && !textareaRef.current.contains(e.target)) {
      handleSave();
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isEditing, editingValue]);

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          className={styles.textarea}
          rows={rows}
          placeholder="optional cooking notes"
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          onClick={() => {
            setEditingValue(value);
            setIsEditing(true);
          }}
          className={styles.display}
        >
          {value ? (
            <div className={styles.markdownContent}>
              <Markdown components={markdownComponents}>{value}</Markdown>
            </div>
          ) : (
            <p className={styles.placeholder}>{placeholder}</p>
          )}
        </div>
      )}
    </section>
  );
}
