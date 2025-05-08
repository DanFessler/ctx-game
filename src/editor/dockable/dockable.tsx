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
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";

type DockableProps = {
  orientation?: "row" | "column";
  panels?: ParsedNode[];
  children: React.ReactNode;
  onChange?: (panels: ParsedNode[]) => void;
  gap?: number;
};

function Dockable({
  orientation = "row",
  children,
  panels: controledPanels,
  onChange,
  gap = 4,
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

  function handleDragStart({ active }) {
    const type = active.data?.current?.type;
    const children = active.data?.current?.children;
    setActive({ id: active.id, type, children });
  }

  function handleDragEnd({ active, over }) {
    setActive(null);
  }

  function handleDragCancel() {
    // console.log("drag cancel");
  }

  function handleDragOver({ active, over }) {
    // console.log("drag over", active, over);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: gap,
        color: colors.text,
        background: colors.gap,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
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
          dispatch={dispatch}
          address={[]}
          gap={gap}
        >
          {views}
        </PanelView>
        <DragOverlay>{active ? active.children : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

export type WindowProps = {
  children: React.ReactNode;
  size?: number;
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
