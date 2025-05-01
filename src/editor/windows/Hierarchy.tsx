import styles from "./Hierarchy.module.css";
import colors from "../colors";
import { FaSearch } from "react-icons/fa";

function SceneHierarchy({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        style={{
          borderBottom: `1px solid ${colors.border}`,
          background: colors.headers,
        }}
      >
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default SceneHierarchy;
