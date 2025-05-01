import { useState } from "react";
import GameObject from "../../engine/GameObject";
import colors from "../colors";
import styles from "./HierarchyList.module.css";
import { PiBoundingBoxFill } from "react-icons/pi";

function HierarchyList({
  gameObjects,
  setSelectedGameObject,
  selectedGameObject,
}: {
  gameObjects: GameObject[];
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | null;
}) {
  return (
    <ul className={styles.list}>
      {gameObjects.map((gameObject) => {
        return (
          <HierarchyItem
            key={gameObject.name}
            gameObject={gameObject}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        );
      })}
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
  selectedGameObject: GameObject | null;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = gameObject.children.length > 0;

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
    <li>
      <div
        className={styles.item}
        style={{
          background:
            selectedGameObject === gameObject ? colors.selected : "transparent",
        }}
        onClick={() => setSelectedGameObject(gameObject)}
      >
        {hasChildren ? renderArrow() : null}
        <PiBoundingBoxFill />
        {gameObject.name}
      </div>
      {isOpen && hasChildren ? (
        <div className={styles.children}>
          <HierarchyList
            gameObjects={gameObject.children}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        </div>
      ) : null}
    </li>
  );
}

export default HierarchyList;
