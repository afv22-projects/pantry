import { Link } from "react-router-dom";

styles = {
  link: "inline-flex items-center gap-1 text-muted font-mono text-sm mb-4 hover:text-text transition-colors",
};

export default function BackLink({ to }) {
  return (
    <Link to={to} className={styles.link}>
      <span>&larr;</span> back
    </Link>
  );
}
