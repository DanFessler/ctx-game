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
  DragEndEvent,
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
import SortableItem from "../components/SortableItem";
import styles from "./Inspector.module.css";
import useGameObject from "../hooks/useGameObject";

function Inspector({ gameObject }: { gameObject: GameObject }) {
  useGameObject(gameObject);

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
      <div
        style={{
          overflow: "auto",
          flex: 1,
          // background: colors.content,
        }}
      >
        <SortableBehaviors
          behaviors={behaviors}
          onReorder={(behaviors) => {
            gameObject.behaviors = behaviors;
            gameObject.updateSubscribers();
          }}
        />
      </div>
      {/* </DndContext> */}
    </div>
  );
}

function SortableBehaviors({
  behaviors,
  onReorder,
}: {
  behaviors: Record<string, Behavior>;
  onReorder: (behaviors: Record<string, Behavior>) => void;
}) {
  const [activeChildren, setActiveChildren] = useState<React.ReactNode | null>(
    null
  );

  const items = Object.keys(behaviors);

  // NOTE: we keep a map of the collapsed state of each behavior here since it's
  // not part of the behavior class itself and just an UI thing, but unless we
  // promote this state to the global store, then every time this remounts, the
  // collapse state is forgotten
  const [collapseMap, setCollapseMap] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(behaviors).map((key) => [key, false]))
  );

  // update the collapse map when a behavior is folded
  function handleFold(key: string, isCollapsed: boolean) {
    setCollapseMap((collapseMap) => ({
      ...collapseMap,
      [key]: isCollapsed,
    }));
  }

  // update the collapse map and items when the behaviors change
  // items is an array of the behavior keys, so we can use it to reorder the
  // behaviors easier with arrayMove
  useEffect(() => {
    setCollapseMap((prevMap) => {
      const newMap = { ...prevMap };

      // Add any new behaviors
      Object.keys(behaviors).forEach((key) => {
        if (!(key in newMap)) {
          newMap[key] = false;
        }
      });

      // Remove any behaviors that no longer exist
      Object.keys(newMap).forEach((key) => {
        if (!(key in behaviors)) {
          delete newMap[key];
        }
      });

      return newMap;
    });

    // update the items
    // setItems(Object.keys(behaviors));
  }, [behaviors]);

  // setup the dnd context
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
      onDragStart={({ active }) => {
        setActiveChildren(active.data?.current?.children);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveChildren(null)}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => {
          return (
            <SortableItem key={id} id={id} data={{ type: "behavior" }}>
              <InspectorBehavior
                behavior={behaviors[id]}
                key={id}
                name={id.toString()}
                isCollapsed={collapseMap[id]}
                onFold={() => handleFold(id, !collapseMap[id])}
              />
            </SortableItem>
          );
        })}
      </SortableContext>
      <DragOverlay>
        {activeChildren ? (
          <div
            style={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.25)",
            }}
          >
            {activeChildren}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id.toString());
      const newIndex = items.indexOf(over.id.toString());

      const newArray = arrayMove(items, oldIndex, newIndex);

      // update the behaviors order
      const reorderedBehaviors: typeof behaviors = {};
      newArray.forEach((id) => {
        reorderedBehaviors[id] = behaviors[id];
      });
      onReorder(reorderedBehaviors);

      // update the items
      return newArray;
    }

    setActiveChildren(null);
  }
}

function InspectorBehavior({
  behavior,
  name,
  isCollapsed,
  onFold,
}: {
  behavior: Behavior;
  name: string;
  isCollapsed: boolean;
  onFold: (isCollapsed: boolean) => void;
}) {
  return (
    <div
      className={styles.behaviorContainer}
      style={{
        // borderBottom: isLast ? "none" : `1px solid ${colors.border}`,
        boxShadow: `0 -1px 0 ${colors.border}`,
        // background: !isDragging ? colors.headers : colors.content,
      }}
    >
      <div
        className={styles.behaviorHeader}
        onClick={() => {
          onFold(!isCollapsed);
        }}
      >
        <input
          type="checkbox"
          checked={behavior.active}
          disabled={!behavior.canDisable}
          onChange={() => {
            behavior.active = !behavior.active;
            behavior.gameObject!.updateSubscribers();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <FaCode />
        <div>{name}</div>
        <div className={styles.spacer} />
        <div className={styles.arrowContainer}>{isCollapsed ? "▶" : "▼"}</div>
        {/* <TiThMenu style={{ minWidth: 14, minHeight: 14 }} /> */}
      </div>
      {!isCollapsed ? (
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
  );
}

export default Inspector;
