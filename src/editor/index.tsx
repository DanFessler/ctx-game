import { useState } from "react";
import GameObject from "../engine/GameObject";
import game from "../game";

import HierarchyList from "./components/HierarchyList";
import TabView, { tabGroupObject } from "./components/TabView";
import SceneHierarchy from "./windows/Hierarchy";
import SceneCanvas from "./windows/SceneCanvas";
import Inspector from "./windows/Inspector";

import "./App.css";
import { FaPlay, FaStop } from "react-icons/fa";
import colors from "./colors";

function App() {
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(game.gameObjects[0]);

  const panels: panelObject[] = [
    {
      size: 1,
      tabs: ["hierarchy"],
    },
    {
      size: 4,
      panels: [
        {
          size: 1,
          tabs: ["scene"],
        },
        {
          size: 1,
          tabs: ["game"],
        },
      ],
    },
    {
      size: 1,
      tabs: ["inspector"],
    },
  ];

  const tabs = {
    inspector: {
      name: "Inspector",
      content: selectedGameObject ? (
        <Inspector gameObject={selectedGameObject} />
      ) : null,
    },
    scene: {
      name: "Scene",
      content: <SceneCanvas />,
    },
    game: {
      name: "Game",
      content: (
        <div
          style={{ background: colors.content, flex: 1, marginTop: 4 }}
        ></div>
      ),
    },
    hierarchy: {
      name: "Hierarchy",
      content: (
        <SceneHierarchy>
          <HierarchyList
            gameObjects={game.gameObjects}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        </SceneHierarchy>
      ),
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
        gap: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          padding: "4px",
          // background: colors.border,
        }}
      >
        <button onClick={() => game.play()}>
          <FaPlay />
        </button>
        <button onClick={() => game.stop()}>
          <FaStop />
        </button>
      </div>
      <PanelView orientation="row" panels={panels}>
        {tabs}
      </PanelView>
    </div>
  );
}

type PanelViewProps = {
  orientation: "row" | "column";
  panels: panelObject[];
  children: tabGroupObject;
};

type panelObject =
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
      {panels.map((panel) => {
        if ("tabs" in panel) {
          const panelTabs = panel.tabs.reduce(
            (acc, tabId) => ({
              ...acc,
              [tabId]: children[tabId],
            }),
            {}
          );

          return <TabView tabs={panelTabs} />;
        } else {
          return (
            <PanelView
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

export default App;
