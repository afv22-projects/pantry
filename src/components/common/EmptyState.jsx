const styles = {
  base: "text-muted font-mono text-sm",
};

export default function EmptyState({ message, centered = false }) {
  return (
    <div className={`${styles.base} ${centered ? styles.base : ""}`}>
      {message}
    </div>
  );
}
