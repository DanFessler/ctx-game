import TabView from "./TabView";
import PanelGroup from "../panelgroup/PanelGroup";
import React from "react";

type PanelProps = {
  orientation: "row" | "column";
  panels: panelObject[];
  children:
    | React.ReactElement<React.ComponentProps<typeof View>>
    | React.ReactElement<React.ComponentProps<typeof View>>[];
};

export type panelObject =
  | { size?: number; tabs: string[] }
  | { size?: number; panels: panelObject[] };

// a list of TabViews with horizontal or vertical orientation
function Panel({ orientation = "row", panels, children }: PanelProps) {
  const sizes = panels.map((panel) => panel.size || 1);
  console.log(sizes);

  // Normalize children to an array
  const childArray = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof View>
  >[];

  return (
    <PanelGroup direction={orientation} gap={4} initialSizes={sizes}>
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
            <Panel
              key={index}
              orientation={orientation === "row" ? "column" : "row"}
              panels={panel.panels}
              children={children}
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

export default Panel;
