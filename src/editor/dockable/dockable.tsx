import React, { useReducer, useEffect } from "react";
import PanelView from "./PanelView";
import appReducer from "./reducer";
import serializeLayout, { ParsedNode } from "./serializeLayout";

type DockableProps = {
  orientation?: "row" | "column";
  panels?: ParsedNode[];
  children: React.ReactNode;
  onChange?: (panels: ParsedNode[]) => void;
};

function Dockable({
  orientation = "row",
  children,
  panels: controledPanels,
  onChange,
}: DockableProps) {
  const views: React.ReactElement<ViewProps>[] = [];

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
    console.log("state changed", state);
    if (onChange) {
      onChange(state.panels);
    }
  }, [state, onChange]);

  return (
    <PanelView
      orientation={orientation}
      panels={state.panels}
      dispatch={dispatch}
      address={[]}
    >
      {views}
    </PanelView>
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
