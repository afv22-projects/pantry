export default function EmptyState({ message, centered = false }) {
  const baseClasses = "text-muted font-mono text-sm";
  const classes = centered ? `${baseClasses} text-center py-12` : baseClasses;

  return (
    <div className={classes}>
      {message}
    </div>
  );
}
