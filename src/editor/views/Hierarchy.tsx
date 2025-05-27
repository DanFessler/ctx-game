import styles from "./Hierarchy.module.css";
import { FaSearch } from "react-icons/fa";
import HierarchyList from "../components/HierarchyList";
import GameObject from "../../engine/GameObject";
import native from "../callNative";
import game from "../../game";
import useGameObjectSelector from "../hooks/useGameObjectSelector";
import Game from "../../engine/Game";
import {
  // closestCorners,
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useState } from "react";
import Transform from "../../engine/behaviors/Transform";

type SceneHierarchyProps = {
  gameObject: GameObject;
};

function SceneHierarchy({ gameObject }: SceneHierarchyProps) {
  const [activeChildren, setActiveChildren] = useState<React.ReactNode | null>(
    null
  );
  const selected = useGameObjectSelector<Game, GameObject | undefined>(
    game,
    (go) => go.selectedGameObject
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    console.log(event, event.over?.data.current);
    const active = event.active.data?.current;
    const current = event.over?.data.current;
    if (!current || !active) return;

    const { objectId: activeId } = active;
    const { objectId: targetId, side } = current;

    // make sure we have the active game objects
    const activeGameObject = game.gameObjects.get(activeId);
    const targetGameObject = game.gameObjects.get(targetId);
    if (!activeGameObject || !targetGameObject) return;

    // first get the world position of the object so we can restore it later
    const transform = activeGameObject.behaviors.Transform as Transform;
    const worldTransform = transform.getWorldTransform(transform);
    // remove activeId from its parent
    activeGameObject.parent?.removeChild(activeGameObject);

    // get index of target in its parent
    const index = targetGameObject.parent?.children.indexOf(targetGameObject);
    if (index === undefined) return;

    if (side === "top") {
      targetGameObject.parent?.addChild(activeGameObject, index);
    } else if (side === "bottom") {
      targetGameObject.parent?.addChild(activeGameObject, index + 1);
    }
    // we must be adding this as a child to the target, rather than a sibling to it
    else {
      targetGameObject.addChild(activeGameObject);
    }

    // restore the world position
    activeGameObject.behaviors.Transform.setWorldTransform(worldTransform);

    setActiveChildren(null);
  }

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        setActiveChildren(active.data?.current?.children);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveChildren(null)}
      // modifiers={[restrictToVerticalAxis]}
    >
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
      <DragOverlay
      // dropAnimation={null}
      >
        {activeChildren}
      </DragOverlay>
    </DndContext>
  );
}

export default SceneHierarchy;
