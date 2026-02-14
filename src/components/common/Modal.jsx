const styles = {
  background:
    "fixed inset-0 bg-black/60 flex items-start justify-center py-8 px-4 z-50 overflow-y-auto",
  modal: "bg-bg border border-border rounded-lg w-full max-w-lg p-6 mb-8",
  title: "text-xl font-normal text-text mb-6 lowercase",
};

export default function Modal({ title, children, isOpen, onClose }) {
  return (
    isOpen && (
      <div className={styles.background} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {children}
        </div>
      </div>
    )
  );
}
