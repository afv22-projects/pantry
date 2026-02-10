export default function Card({ children, className = "", as = "div", ...props }) {
  const Component = as;
  const baseClasses = "bg-surface border border-border rounded-lg px-4 py-4 hover:border-muted transition-colors";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
}
