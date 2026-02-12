const styles = {
  text: "text-red-500 font-mono",
};

export default function ErrorMessage({ children }) {
  return <div className={styles.text}>{children}</div>;
}
