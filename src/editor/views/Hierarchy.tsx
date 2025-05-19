import styles from "./Hierarchy.module.css";
import { FaSearch } from "react-icons/fa";
import HierarchyList from "../components/HierarchyList";
import GameObject from "../../engine/GameObject";

type SceneHierarchyProps = {
  gameObjects: GameObject[];
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | null;
};

function SceneHierarchy({
  gameObjects,
  setSelectedGameObject,
  selectedGameObject,
}: SceneHierarchyProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.content}>
        <HierarchyList
          gameObjects={gameObjects}
          setSelectedGameObject={setSelectedGameObject}
          selectedGameObject={selectedGameObject}
        />
      </div>
    </div>
  );
}

export default SceneHierarchy;
