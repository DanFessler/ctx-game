import { useState, useEffect } from "react";
import {
  useDraggable,
  DragOverlay,
  useDndContext,
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";
import colors from "../colors";
import { PiBoundingBoxFill } from "react-icons/pi";
import { FaCode } from "react-icons/fa";
// import { TiThMenu } from "react-icons/ti";
import { HiDotsVertical as TiThMenu } from "react-icons/hi";

import styles from "./Inspector.module.css";

function useGameObjejct(gameObject: GameObject) {
  const [, setCount] = useState(0);
  useEffect(() => {
    const unsubscribe = gameObject.subscribe(() => {
      setCount((count) => count + 1);
    });
    return () => unsubscribe();
  }, [gameObject]);
}

function Inspector({ gameObject }: { gameObject: GameObject }) {
  useGameObjejct(gameObject);
  const [draggingBehavior, setDraggingBehavior] = useState<string | null>(null);
  const { active } = useDndContext();

  const behaviors = gameObject.behaviors;

  // Update draggingBehavior based on the active drag
  useEffect(() => {
    if (active) {
      setDraggingBehavior(active.id as string);
    } else {
      setDraggingBehavior(null);
    }
  }, [active]);

  return (
    <div className={styles.inspector}>
      <div
        className={styles.header}
        style={{
          // borderBottom: `1px solid ${colors.border}`,
          background: colors.headers,
        }}
      >
        <input
          type="checkbox"
          checked={gameObject.isActive}
          onChange={() => {
            gameObject.isActive = !gameObject.isActive;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <PiBoundingBoxFill style={{ width: "16px", height: "16px" }} />
        <input
          type="text"
          value={gameObject.name}
          onChange={(e) => {
            gameObject.name = e.target.value;
          }}
          className={styles.nameInput}
        />
      </div>
      {/* <DndContext sensors={sensors}> */}
      <div style={{ overflow: "auto", flex: 1 }}>
        {Object.entries(behaviors).map(([key, behavior]) => {
          return (
            <InspectorBehavior
              behavior={behavior}
              key={key}
              name={key}
              id={key}
            />
          );
        })}
      </div>
      <DragOverlay
        modifiers={
          [
            // restrictToVerticalAxis
          ]
        }
      >
        {draggingBehavior ? (
          <div
            style={{
              overflow: "auto",
              flex: 1,
              borderRadius: 4,
              boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.25)",
            }}
          >
            <InspectorBehavior
              behavior={behaviors[draggingBehavior]}
              key={draggingBehavior}
              name={draggingBehavior}
              id={draggingBehavior}
            />
          </div>
        ) : null}
      </DragOverlay>
      {/* </DndContext> */}
    </div>
  );
}

function InspectorBehavior({
  behavior,
  name,
  id,
}: {
  behavior: Behavior;
  name: string;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
  });

  return (
    <div
      className={styles.behaviorContainer}
      style={{
        borderTop: `1px solid ${colors.border}`,
        background: !isDragging ? colors.headers : colors.content,
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <div
        style={{
          opacity: isDragging ? 0 : 1, // Optional: add visual feedback for dragging
        }}
      >
        <div
          className={styles.behaviorHeader}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <input
            type="checkbox"
            checked={behavior.active}
            disabled={!behavior.canDisable}
            onChange={() => {
              behavior.gameObject!.updateSubscribers();
              behavior.active = !behavior.active;
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <FaCode />
          <div>{name}</div>
          <div className={styles.spacer} />
          <div className={styles.arrowContainer}>{isOpen ? "▼" : "▶"}</div>
          <TiThMenu style={{ minWidth: 14, minHeight: 14 }} />
        </div>
        {isOpen ? (
          <div
            className={styles.behaviorContent}
            // style={{ background: colors.content }}
          >
            <behavior.inspector
              refresh={() => {
                behavior.gameObject!.updateSubscribers();
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Inspector;
