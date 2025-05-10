import styles from "./TabView.module.css";

function Tab({
  name,
  selected = true,
  onClick,
}: {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <span
      className={styles.tab + (selected ? " " + styles.selected : "")}
      onPointerDown={onClick}
    >
      {name}
      {selected && <div className={styles.tabCornerRight} />}
      {selected && <div className={styles.tabCornerLeft} />}
    </span>
  );
}

export default Tab;
