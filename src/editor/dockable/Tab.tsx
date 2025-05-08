import colors from "../colors";
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
      style={{
        background: selected ? colors.headers : "transparent",
      }}
      onPointerDown={onClick}
    >
      {name}
    </span>
  );
}

export default Tab;
