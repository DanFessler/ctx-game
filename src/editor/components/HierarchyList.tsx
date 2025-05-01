import { useState } from "react";

import GameObject from "../../engine/GameObject";
import colors from "../colors";
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
    <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
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
        style={{
          width: "16px",
          position: "absolute",
          left: "8px",
        }}
      >
        {isOpen ? "▼" : "▶"}
      </div>
    );
  }

  return (
    <li>
      <div
        style={{
          position: "relative",
          padding: "4px 0 4px 24px",
          background:
            selectedGameObject === gameObject ? colors.selected : "transparent",
          // borderRadius: "4px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
          whiteSpace: "nowrap",
        }}
        onClick={() => setSelectedGameObject(gameObject)}
      >
        {hasChildren ? renderArrow() : null}
        <PiBoundingBoxFill />
        {gameObject.name}
      </div>
      {isOpen && hasChildren ? (
        <div style={{ marginLeft: "16px" }}>
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
