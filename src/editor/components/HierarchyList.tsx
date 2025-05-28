import { useState } from "react";
import GameObject from "../../engine/GameObject";
import styles from "./HierarchyList.module.css";
import { PiBoundingBoxFill } from "react-icons/pi";
import useGameObjectSelector from "../hooks/useGameObjectSelector";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Dockable } from "@danfessler/react-dockable";

function HierarchyList({
  gameObject,
  setSelectedGameObject,
  selectedGameObject,
  isDragging: isDraggingProp = false,
  canDrop = false,
}: {
  gameObject: GameObject;
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | undefined;
  isDragging?: boolean;
  canDrop?: boolean;
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: gameObject.id,
    data: {
      children: (
        <ul className={styles.list}>
          <HierarchyItem
            gameObject={gameObject}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
            isDragging={true}
            canDrop={canDrop}
          />
        </ul>
      ),
      type: "game-object",
      objectId: gameObject.id,
    },
  });

  // doing it this way ensures we can't drag or drop on the root object
  const draggableProps = canDrop
    ? {
        ref: setNodeRef,
        ...attributes,
        ...listeners,
        style: {
          // transform: CSS.Translate.toString(transform),
          opacity: isDragging ? 0.25 : 1,
        },
      }
    : {};

  return (
    <ul className={styles.list} {...draggableProps}>
      <HierarchyItem
        gameObject={gameObject}
        setSelectedGameObject={setSelectedGameObject}
        selectedGameObject={selectedGameObject}
        isDragging={isDragging || isDraggingProp}
        canDrop={canDrop}
      />
      {!(isDragging || isDraggingProp) && canDrop && (
        <DroppableDivider side="bottom" id={gameObject.id} />
      )}
    </ul>
  );
}

function HierarchyItem({
  gameObject,
  setSelectedGameObject,
  selectedGameObject,
  isDragging,
  canDrop,
}: {
  gameObject: GameObject;
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | undefined;
  isDragging: boolean;
  canDrop: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = gameObject.children.length > 0;
  const name = useGameObjectSelector<GameObject, string>(
    gameObject,
    (go) => go.name
  );

  const { setNodeRef, isOver } = useDroppable({
    id: gameObject.id,
    data: {
      type: "reparent-object",
      objectId: gameObject.id,
    },
  });

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
      <Dockable.Menu
        id={gameObject.id}
        mode="context"
        customItems={[
          {
            items: [
              {
                label: "Delete",
                onClick: () => {
                  gameObject.parent?.removeChild(gameObject);
                  gameObject.updateSubscribers();
                },
              },
            ],
          },
        ]}
      >
        <div
          className={`${styles.item} ${
            selectedGameObject === gameObject || isOver ? styles.selected : ""
          }`}
          onClick={() => setSelectedGameObject(gameObject)}
        >
          {hasChildren ? renderArrow() : null}
          <PiBoundingBoxFill />
          {name}
          {!isDragging && canDrop && (
            <>
              <DroppableDivider side="top" id={gameObject.id} />
              <div
                ref={setNodeRef}
                style={{
                  position: "absolute",
                  left: 0,
                  width: "calc(100% - 24px)",
                  height: 4,
                  top: "50%",
                  marginLeft: 24,
                  // backgroundColor: "red",
                }}
              />
            </>
          )}
        </div>
      </Dockable.Menu>
      {isOpen && hasChildren ? (
        <div className={styles.children}>
          {gameObject.children.map((child) => {
            return (
              <HierarchyList
                key={child.id + "-parent"}
                gameObject={child}
                setSelectedGameObject={setSelectedGameObject}
                selectedGameObject={selectedGameObject}
                isDragging={isDragging}
                canDrop={true}
              />
            );
          })}
        </div>
      ) : null}
    </li>
  );
}

type DroppableDividerProps = {
  side: "top" | "bottom";
  id: string;
};
function DroppableDivider({ side, id }: DroppableDividerProps) {
  // useDroppable
  const { setNodeRef, isOver } = useDroppable({
    id: id + "-" + side,
    data: {
      objectId: id,
      side: side,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: "calc(100% - 24px)",
        height: 4,
        background: "red",
        position: "absolute",
        marginLeft: 24,
        borderRadius: 2,
        // backgroundColor: "red",
        backgroundColor: isOver
          ? "var(--dockable-colors-selected)"
          : "transparent",
        zIndex: 1,
        left: 0,
        [side]: -2,
      }}
    />
  );
}

export default HierarchyList;
