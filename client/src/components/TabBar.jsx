import { NavLink } from "react-router-dom";
import { useStore } from "../store";

export default function TabBar() {
  const { state } = useStore();

  const groceryCount = state.ingredients.filter((i) => i.needed).length;

  const tabs = [
    { path: "/recipes", label: "recipes" },
    { path: "/ingredients", label: "ingredients" },
    { path: "/grocery", label: "grocery list", showBadge: true },
  ];

  return (
    <nav className="flex">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 font-mono text-[13px] lowercase tracking-wide transition-colors ${
              isActive
                ? "text-text border-b border-text"
                : "text-muted hover:text-text"
            }`
          }
        >
          {tab.label}
          {tab.showBadge && groceryCount > 0 && (
            <span className="bg-accent text-white text-[10px] font-semibold rounded-lg px-1.5 py-px leading-4">
              {groceryCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
