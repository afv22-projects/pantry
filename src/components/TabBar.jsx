import { NavLink } from "react-router-dom";
import { useIngredients, useConsumables } from "../state";

const styles = {
  nav: "flex",
  navLinkBase:
    "flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[13px] lowercase tracking-wide transition-colors flex-1",
  navLinkActive: "text-text border-b border-text",
  navLinkInactive: "text-muted hover:text-text",
  badge:
    "bg-accent text-white text-[10px] font-semibold rounded-lg px-1.5 py-px leading-4",
};

export default function TabBar() {
  const { data: ingredients } = useIngredients();
  const { data: consumables } = useConsumables();

  const ingredientCount = (ingredients || []).filter((i) => i.needed).length;
  const consumableCount = (consumables || []).filter((c) => c.needed).length;
  const groceryCount = ingredientCount + consumableCount;

  const tabs = [
    { path: "/recipes", label: "RCP" },
    { path: "/ingredients", label: "ING" },
    { path: "/consumables", label: "CNS" },
    { path: "/grocery", label: "GRC", showBadge: true },
  ];

  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `${styles.navLinkBase} ${
              isActive ? styles.navLinkActive : styles.navLinkInactive
            }`
          }
        >
          {tab.label}
          {tab.showBadge && groceryCount > 0 && (
            <span className={styles.badge}>{groceryCount}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
