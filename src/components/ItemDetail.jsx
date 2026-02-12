import { Button, Card, EmptyState, BackLink } from "./common";
import { Link } from "react-router-dom";

export default function ItemDetail({
  item,
  itemType,
  isLoading,
  backLink,
  categoryInput,
  relatedItems,
  onToggleNeeded,
  onDelete,
}) {
  if (isLoading) {
    return <div className="text-muted font-mono">loading...</div>;
  }

  if (!item) {
    return (
      <div className="text-muted font-mono text-sm">
        {itemType} not found.{" "}
        <Link to={backLink} className="text-accent hover:underline">
          go back
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`delete this ${itemType}?`)) {
      onDelete();
    }
  };

  return (
    <div>
      <BackLink to={backLink} />

      <h2 className="text-2xl font-normal text-text mb-6 lowercase">
        {item.name}
      </h2>

      <Button
        variant="toggle"
        active={item.needed}
        onClick={onToggleNeeded}
        className="mb-6"
      >
        {item.needed ? "marked as needed" : "+ mark as needed"}
      </Button>

      <section className="mb-8">
        <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
          Category
        </h3>
        {categoryInput}
      </section>

      {relatedItems && (
        <section>
          <h3 className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">
            {relatedItems.title}
          </h3>
          {relatedItems.items.length === 0 ? (
            <EmptyState message={relatedItems.emptyMessage} />
          ) : (
            <div className="space-y-2">
              {relatedItems.items.map((relatedItem) => (
                <Card key={relatedItem.id} as={Link} to={relatedItem.link}>
                  <span className="text-text lowercase">{relatedItem.name}</span>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      <Button
        variant="danger"
        onClick={handleDelete}
        className="mt-8"
      >
        delete {itemType}
      </Button>
    </div>
  );
}
