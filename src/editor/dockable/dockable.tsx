import React, { useReducer, useEffect, useState } from "react";
import PanelView from "./PanelView";
import appReducer from "./reducer";
import serializeLayout, { ParsedNode } from "./serializeLayout";
import colors from "../colors";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragEndEvent,
  // DragCancelEvent,
  DragOverEvent,
} from "@dnd-kit/core";
// import { createSnapModifier } from "@dnd-kit/modifiers";
import { DockableContext } from "./DockableContext";
import { dockableCollision } from "./dockableCollision";

import { useDndContext } from "@dnd-kit/core";

type Size = { width: number; height: number } | null;

function useOverlaySizeFromDroppable(): Size {
  const { over } = useDndContext();
  const [size, setSize] = useState<Size>(null);

  useEffect(() => {
    if (!over?.id) {
      setSize(null);
      return;
    }

    const selector = `[data-droppable-id="${over.id}"]`;
    const el = document.querySelector<HTMLElement>(selector);

    if (!el) {
      setSize(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    // Optional: you could also watch for resize/mutation here
  }, [over?.id]);

  return size;
}

type DockableProps = {
  orientation?: "row" | "column";
  panels?: ParsedNode[];
  children: React.ReactNode;
  onChange?: (panels: ParsedNode[]) => void;
  gap?: number;
  radius?: number;
};

function Dockable({
  orientation = "row",
  children,
  panels: controledPanels,
  onChange,
  gap = 4,
  radius = 4,
}: DockableProps) {
  const views: React.ReactElement<ViewProps>[] = [];
  const [active, setActive] = useState<{
    id: string;
    type: string;
    children: React.ReactNode;
  } | null>(null);
  const overlaySize = useOverlaySizeFromDroppable();
  console.log(overlaySize);

  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement[];

  const declarativePanels = childrenArray.map((child) =>
    serializeLayout(child, views)
  );

  const [state, dispatch] = useReducer(appReducer, {
    panels: controledPanels || declarativePanels,
  });

  useEffect(() => {
    if (onChange) {
      onChange(state.panels);
    }
  }, [state, onChange]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(pointerSensor);

  function handleDragStart({ active }: DragStartEvent) {
    const type = active.data.current?.type;
    const children = active.data.current?.children;
    setActive({ id: active.id.toString(), type, children });
  }

  function handleDragCancel() {
    // console.log("drag cancel");
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    dispatch({
      type: "reorderTabs",
      activeId: active.id.toString(),
      overId: over.id.toString(),
    });
    setActive(null);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    // console.log("drag over", active, over);
    if (!over) return;
    console.log("drag over", active, over);
    // dispatch({ type: "moveTab", activeId: active.id, overId: over.id });
  }

  // console.log(active);

  return (
    <DockableContext.Provider value={{ state, dispatch }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: gap,
          color: colors.text,
          background: colors.gap,
          // @ts-expect-error - radius is variable
          "--radius": radius + "px",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={dockableCollision}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
          modifiers={
            [
              // restrictToVerticalAxis
            ]
          }
        >
          <PanelView
            orientation={orientation}
            panels={state.panels}
            address={[]}
            gap={gap}
          >
            {views}
          </PanelView>
          <DragOverlay>
            {active ? (
              <div
                style={{
                  borderRadius: radius,
                  overflow: "hidden",
                  boxShadow: "0 1px 5px 1px rgba(0, 0, 0, 0.25)",
                  width: overlaySize?.width,
                  height: overlaySize?.height,
                }}
              >
                {active.children}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </DockableContext.Provider>
  );
}

export type WindowProps = {
  children: React.ReactNode;
  size?: number;
  selected?: number;
};
export function Window(props: WindowProps) {
  return props.children;
}

export type ViewProps = {
  id: string;
  name: string;
  children: React.ReactNode;
};
export function View(props: ViewProps) {
  return props.children;
}

export type PanelProps = {
  orientation?: "row" | "column";
  size?: number;
  children: React.ReactNode;
};

export function Panel(props: PanelProps) {
  return props.children;
}

export default Dockable;
