import TabView from "./TabView";
import PanelGroup from "../panelgroup/PanelGroup";
import React from "react";

type PanelViewProps = {
  orientation: "row" | "column";
  panels: panelObject[];
  children:
    | React.ReactElement<React.ComponentProps<typeof Window>>
    | React.ReactElement<React.ComponentProps<typeof Window>>[];
};

export type panelObject =
  | { size?: number; tabs: string[] }
  | { size?: number; panels: panelObject[] };

// a list of TabViews with horizontal or vertical orientation
function PanelView({ orientation = "row", panels, children }: PanelViewProps) {
  const sizes = panels.map((panel) => panel.size || 1);
  console.log(sizes);

  // Normalize children to an array
  const childArray = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof Window>
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
            <PanelView
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

export const Window: React.FC<WindowProps> = ({ children }) => <>{children}</>;

export default PanelView;
