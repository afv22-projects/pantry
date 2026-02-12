import { useMemo } from "react";

const styles = {
  emptyMessage: "text-muted font-mono text-sm",
  container: "space-y-6",
  categoryTitle:
    "font-mono text-[11px] text-muted uppercase tracking-wider mb-3",
  itemsList: "flex flex-wrap gap-2",
};

export default function GroupedList({
  items,
  getCategory,
  sortItems = (a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  renderItem,
  emptyMessage = "no items to display",
}) {
  const groupedItems = useMemo(() => {
    const groups = {};

    items.forEach((item) => {
      const category = getCategory(item)?.trim() || "uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    // Sort items within each group
    Object.keys(groups).forEach((category) => {
      groups[category].sort(sortItems);
    });

    // Sort categories alphabetically, but keep "uncategorized" at the end
    const sortedCategories = Object.keys(groups).sort((a, b) => {
      if (a === "uncategorized") return 1;
      if (b === "uncategorized") return -1;
      return a.localeCompare(b);
    });

    return sortedCategories.map((category) => ({
      category,
      items: groups[category],
    }));
  }, [items, getCategory, sortItems]);

  if (items.length === 0) {
    return <div className={styles.emptyMessage}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.container}>
      {groupedItems.map(({ category, items }) => (
        <section key={category}>
          <h3 className={styles.categoryTitle}>{category}</h3>
          <div className={styles.itemsList}>{items.map(renderItem)}</div>
        </section>
      ))}
    </div>
  );
}
