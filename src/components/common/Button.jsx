const styles = {
  base: "font-mono transition-colors cursor-pointer",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  active = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  const variants = {
    primary: `bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed ${
      size === "sm" ? "text-[12px] px-3 py-1.5" : "text-[13px] py-2.5"
    }`,
    secondary: `text-muted hover:text-text ${
      size === "sm" ? "text-[12px] px-3 py-1.5" : "text-[13px] px-4 py-2.5"
    }`,
    danger: "text-[12px] text-muted hover:text-red-400",
    toggle: `text-[14px] px-4 py-3 rounded border ${
      active
        ? "bg-accent text-white border-accent"
        : "text-muted border-border hover:border-muted"
    }`,
    fab: "fixed bottom-6 right-6 bg-accent text-white w-14 h-14 rounded-full text-2xl font-light shadow-lg hover:bg-accent/90",
    checkbox: `w-5 h-5 rounded border flex items-center justify-center ${
      active ? "bg-accent border-accent" : "border-muted hover:border-text"
    }`,
    icon: "text-muted hover:text-text p-1",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
