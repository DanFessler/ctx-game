import TabView, { tabGroupObject } from "./TabView";

type PanelViewProps = {
  orientation: "row" | "column";
  panels: panelObject[];
  children: tabGroupObject;
};

export type panelObject =
  | { size?: number; tabs: string[] }
  | { size?: number; panels: panelObject[] };

// a list of TabViews with horizontal or vertical orientation
function PanelView({ orientation = "row", panels, children }: PanelViewProps) {
  const sizes = panels.map((panel) => panel.size || 1).join("fr ") + "fr";
  console.log(sizes);
  return (
    <div
      style={{
        // display: "flex",
        flexDirection: orientation,
        flex: 1,
        width: "100%",
        justifyContent: "stretch",
        gap: "3px",
        display: "grid",
        ...(orientation === "row"
          ? { gridTemplateColumns: sizes }
          : { gridTemplateRows: sizes }),
      }}
    >
      {panels.map((panel, index) => {
        if ("tabs" in panel) {
          const panelTabs = panel.tabs.map((tabId) => {
            const tab = children.find((child) => child.id === tabId);
            if (!tab) {
              throw new Error(`Tab ${tabId} not found`);
            }
            return tab;
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
    </div>
  );
}

export default PanelView;
