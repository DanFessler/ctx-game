import TabView from "./TabView";
import PanelGroup from "../panelgroup/PanelGroup";
import React from "react";

type PanelProps = {
  orientation: "row" | "column";
  panels: panelObject[];
  children:
    | React.ReactElement<React.ComponentProps<typeof View>>
    | React.ReactElement<React.ComponentProps<typeof View>>[];

  dispatch: (action: {
    type: "resize";
    sizes: number[];
    address: number[];
  }) => void;
  address: number[];
  gap?: number;
};

export type panelObject =
  | { size?: number; tabs: string[] }
  | { size?: number; orientation?: "row" | "column"; panels: panelObject[] };

// a list of TabViews with horizontal or vertical orientation
function PanelView({
  orientation = "row",
  panels,
  children,
  dispatch,
  address,
  gap,
}: PanelProps) {
  const sizes = panels.map((panel) => panel.size || 1);

  // Normalize children to an array
  const childArray = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof View>
  >[];

  function handleResizeEnd(sizes: number[]) {
    // console.log(sizes);
    dispatch({ type: "resize", sizes, address });
  }

  return (
    <PanelGroup
      direction={orientation}
      gap={gap}
      initialSizes={sizes}
      onResizeEnd={handleResizeEnd}
    >
      {panels.map((panel, index) => {
        if ("tabs" in panel) {
          const panelTabs = panel.tabs.map((tabId) => {
            const tab = childArray.find(({ props }) => props.id === tabId);
            if (!tab) {
              throw new Error(`Tab ${tabId} not found`);
            }
            return {
              id: tab.props.id,
              name: tab.props.name,
              content: tab,
            };
          });
          return <TabView tabs={panelTabs} />;
        } else {
          return (
            <PanelView
              key={index}
              orientation={
                panel.orientation !== undefined
                  ? panel.orientation
                  : orientation === "row"
                  ? "column"
                  : "row"
              }
              panels={panel.panels}
              children={children}
              dispatch={dispatch}
              address={address.concat(index)}
              gap={gap}
            />
          );
        }
      })}
    </PanelGroup>
  );
}

type WindowProps = {
  id: string;
  name: string;
  children: React.ReactNode;
};

export const View: React.FC<WindowProps> = ({ children }) => <>{children}</>;

export default PanelView;
