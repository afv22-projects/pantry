import { Button, Card, EmptyState, Loading, BackLink } from "./common";
import { Link } from "react-router-dom";

const styles = {
  loading: "text-muted font-mono",
  missingItem: "text-muted font-mono text-sm",
  missingItemLink: "text-accent hover:underline",
  name: "text-2xl font-normal text-text mb-6 lowercase",
  needed: "mb-6",
  category: "mb-8",
  categoryTitle:
    "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  delete: "mt-8",
  relatedItemsTitle:
    "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  relatedItemsWrapper: "space-y-2",
  relatedItemName: "text-text lowercase",
};

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
  if (isLoading) return <Loading />;

  if (!item) {
    return (
      <div className={styles.missingItem}>
        {itemType} not found.{" "}
        <Link to={backLink} className={styles.missingItemLink}>
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
    <>
      <BackLink to={backLink} />

      <h2 className={styles.name}>{item.name}</h2>

      <Button
        variant="toggle"
        active={item.needed}
        onClick={onToggleNeeded}
        className={styles.needed}
      >
        {item.needed ? "marked as needed" : "+ mark as needed"}
      </Button>

      <section className={styles.category}>
        <h3 className={styles.categoryTitle}>Category</h3>
        {categoryInput}
      </section>

      {relatedItems && (
        <section>
          <h3 className={styles.relatedItemsTitle}>{relatedItems.title}</h3>
          {relatedItems.items.length === 0 ? (
            <EmptyState message={relatedItems.emptyMessage} />
          ) : (
            <div className={styles.relatedItemsWrapper}>
              {relatedItems.items.map((relatedItem) => (
                <Card key={relatedItem.id} as={Link} to={relatedItem.link}>
                  <span className={styles.relatedItemName}>
                    {relatedItem.name}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      <Button variant="danger" onClick={handleDelete} className={styles.delete}>
        delete {itemType}
      </Button>
    </>
  );
}
