import { useState } from "react";
import GameObject from "../../engine/GameObject";
import styles from "./HierarchyList.module.css";
import { PiBoundingBoxFill } from "react-icons/pi";
import useGameObjectSelector from "../hooks/useGameObjectSelector";

function HierarchyList({
  gameObject,
  setSelectedGameObject,
  selectedGameObject,
}: {
  gameObject: GameObject;
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | undefined;
}) {
  return (
    <ul className={styles.list}>
      <HierarchyItem
        gameObject={gameObject}
        setSelectedGameObject={setSelectedGameObject}
        selectedGameObject={selectedGameObject}
      />
    </ul>
  );
}

function HierarchyItem({
  gameObject,
  setSelectedGameObject,
  selectedGameObject,
}: {
  gameObject: GameObject;
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | undefined;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = gameObject.children.length > 0;
  const name = useGameObjectSelector(gameObject, (go) => go.name);

  console.log("rendering HierarchyItem", gameObject.name, name);

  function renderArrow() {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={styles.arrow}
      >
        {isOpen ? "▼" : "▶"}
      </div>
    );
  }

  return (
    <li draggable={true}>
      <div
        className={styles.item}
        style={{
          background:
            selectedGameObject === gameObject
              ? "var(--dockable-colors-selected)"
              : "transparent",
        }}
        onClick={() => setSelectedGameObject(gameObject)}
      >
        {hasChildren ? renderArrow() : null}
        <PiBoundingBoxFill />
        {gameObject.name}
      </div>
      {isOpen && hasChildren ? (
        <div className={styles.children}>
          {gameObject.children.map((child) => {
            return (
              <HierarchyList
                gameObject={child}
                setSelectedGameObject={setSelectedGameObject}
                selectedGameObject={selectedGameObject}
              />
            );
          })}
        </div>
      ) : null}
    </li>
  );
}

export default HierarchyList;
