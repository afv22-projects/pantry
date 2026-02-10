import { Link } from "react-router-dom";

export default function BackLink({ to }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-muted font-mono text-sm mb-4 hover:text-text transition-colors"
    >
      <span>&larr;</span> back
    </Link>
  );
}
