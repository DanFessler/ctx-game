import TabView from "./TabView";
import PanelGroup from "../panelgroup/PanelGroup";
import React from "react";
import { LayoutNode, PanelNode, WindowNode } from "./serializeLayout";
import { useDockable } from "./DockableContext";
import Droppable from "../components/Droppable";
// import styles from "./PanelView.module.css";

type PanelProps = {
  orientation: "row" | "column";
  children:
    | React.ReactElement<React.ComponentProps<typeof View>>
    | React.ReactElement<React.ComponentProps<typeof View>>[];
  address: number[];
  gap?: number;
  panels: LayoutNode[];
};

// a list of TabViews with horizontal or vertical orientation
function PanelView({
  orientation = "row",
  children,
  address,
  gap,
  panels,
}: PanelProps) {
  const { dispatch } = useDockable();

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
      // handleClassName={styles.handle}
      handleComponent={(index: number) => (
        <Droppable
          id={`${address.join("-")}-handle-${index}`}
          data={{ type: "insert-panel" }}
          style={{
            width: "calc(100% + 16px)",
            height: "calc(100% + 16px)",
            position: "absolute",
            top: "-8px",
            left: "-8px",
            transition: "all 0.1s ease-in-out",
          }}
          overStyle={{
            backgroundColor: "var(--selected)",
          }}
        />
      )}
    >
      {panels.map((panel, index) => {
        if (panel.type === "Window") {
          const panelTabs = panel.children.map((tabId) => {
            const tab = childArray.find(({ props }) => props.id === tabId);
            if (!tab) {
              console.log("tabid", tabId);
              throw new Error(`Tab ${tabId} not found`);
            }
            return {
              id: tab.props.id,
              name: tab.props.name,
              content: tab,
            };
          });
          return (
            <TabView
              id={panel.id}
              tabs={panelTabs}
              selected={(panel as WindowNode).selected.toString()}
              orientation={orientation}
              address={address.concat(index)}
            />
          );
        } else {
          const _panel = panel as PanelNode;
          return (
            <PanelView
              key={index}
              orientation={
                _panel.orientation !== undefined
                  ? _panel.orientation
                  : orientation === "row"
                  ? "column"
                  : "row"
              }
              panels={_panel.children}
              children={children}
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
