import { useState, useEffect } from "react";
// import { useDraggable, DragOverlay, useDndContext } from "@dnd-kit/core";
import {
  DndContext,
  // closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";
import colors from "../colors";
import { PiBoundingBoxFill } from "react-icons/pi";
import { FaCode } from "react-icons/fa";
// import { TiThMenu } from "react-icons/ti";
import { HiDotsVertical as TiThMenu } from "react-icons/hi";
import SortableItem from "../components/SortableItem";
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

  const behaviors = gameObject.behaviors;

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
        <SortableBehaviors behaviors={behaviors} />
      </div>
      {/* </DndContext> */}
    </div>
  );
}

function InspectorBehavior({
  behavior,
  name,
}: {
  behavior: Behavior;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={styles.behaviorContainer}
      style={{
        borderTop: `1px solid ${colors.border}`,
        // background: !isDragging ? colors.headers : colors.content,
      }}
    >
      <div
        style={
          {
            // opacity: isDragging ? 0 : 1,
          }
        }
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

function SortableBehaviors({
  behaviors,
}: {
  behaviors: Record<string, Behavior>;
}) {
  const [items, setItems] = useState(Object.keys(behaviors));
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} type="behavior">
            <InspectorBehavior
              behavior={behaviors[id]}
              key={id}
              name={id.toString()}
            />
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.25)",
            }}
          >
            <InspectorBehavior
              behavior={behaviors[activeId]}
              name={activeId.toString()}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }
}

export default Inspector;
