const styles = {
  base: "bg-surface border border-border rounded-lg px-4 py-4 hover:border-muted transition-colors",
};

export default function Card({
  children,
  className = "",
  as = "div",
  ...props
}) {
  const Component = as;
  return (
    <Component className={`${styles.base} ${className}`} {...props}>
      {children}
    </Component>
  );
}
