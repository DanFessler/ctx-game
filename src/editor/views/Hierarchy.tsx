import styles from "./Hierarchy.module.css";
import { FaSearch } from "react-icons/fa";
import HierarchyList from "../components/HierarchyList";
import GameObject from "../../engine/GameObject";
import native from "../callNative";
import game from "../../game";
import useGameObjectSelector from "../hooks/useGameObjectSelector";
import Game from "../../engine/Game";

type SceneHierarchyProps = {
  gameObject: GameObject;
  // setSelectedGameObject: (gameObject: GameObject) => void;
  // selectedGameObject: GameObject | null;
};

function SceneHierarchy({
  gameObject,
}: // setSelectedGameObject,
// selectedGameObject,
SceneHierarchyProps) {
  const selected = useGameObjectSelector(
    game,
    (go) => (go as Game).selectedGameObject
  );
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
          gameObject={gameObject}
          setSelectedGameObject={(gameObject) => {
            game.selectedGameObject = gameObject;
            game.updateSubscribers();
          }}
          selectedGameObject={selected}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          margin: 4,
          flexDirection: "column",
        }}
      >
        <button
          onClick={() => {
            const serialized = gameObject.serialize();
            native.saveFile(
              "src/game/scenes/default.json",
              JSON.stringify(serialized, null, 2)
            );
          }}
        >
          Save Scene
        </button>
        <button
          onClick={() => {
            const newGameObject = new GameObject({
              name: "New GameObject",
            });
            gameObject.addChild(newGameObject);
          }}
        >
          New GameObject
        </button>
      </div>
    </div>
  );
}

export default SceneHierarchy;
