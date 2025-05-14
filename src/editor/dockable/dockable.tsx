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
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { DockableContext } from "./DockableContext";
import { dockableCollision } from "./dockableCollision";

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
    switch (over.data.current?.type) {
      case "tab-bar":
        return dispatch({
          type: "moveTab",
          tabId: active.id.toString(),
          sourceWindowAddress: active.data.current?.address,
          targetWindowAddress: over.data.current?.address,
        });
      case "tab":
        if (active.data.current?.parentId === over.data.current?.parentId) {
          return dispatch({
            type: "reorderTabs",
            sourceTabId: active.id.toString(),
            targetTabId: over.id.toString(),
            address: active.data.current?.address,
          });
        }
        return dispatch({
          type: "moveTab",
          tabId: active.id.toString(),
          sourceWindowAddress: active.data.current?.address,
          targetWindowAddress: over.data.current?.address,
        });
      case "edge-zone":
        return dispatch({
          type: "splitWindow",
          tabId: active.id.toString(),
          sourceWindowAddress: active.data.current?.address,
          targetWindowAddress: over.data.current?.address,
          direction: over.data.current.side,
          orientation: over.data.current.orientation,
        });
    }
    setActive(null);
  }

  // function handleDragOver({ active, over }: DragOverEvent) {
  //   if (!over) return;
  //   const overType = over.data.current?.type;
  //   if (overType !== "tab") return;
  //   dispatch({
  //     type: "moveTab",
  //     activeId: active.id as string,
  //     overId: over.id as string,
  //   });
  // }

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
          // onDragOver={handleDragOver}
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
