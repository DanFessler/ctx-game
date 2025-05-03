import { useState } from "react";
import GameObject from "../engine/GameObject";
import game from "../game";

import HierarchyList from "./components/HierarchyList";
import SceneHierarchy from "./windows/Hierarchy";
import SceneCanvas from "./windows/SceneCanvas";
import Inspector from "./windows/Inspector";
import PanelView, { panelObject } from "./dockable/PanelView";

import "./App.css";
import { FaPlay, FaStop } from "react-icons/fa";
import colors from "./colors";

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

function App() {
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(game.gameObjects[0]);

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
        {[
          {
            id: "inspector",
            name: "Inspector",
            content: selectedGameObject ? (
              <Inspector gameObject={selectedGameObject} />
            ) : null,
          },
          {
            id: "scene",
            name: "Scene",
            content: <SceneCanvas />,
          },
          {
            id: "game",
            name: "Game",
            content: (
              <div
                style={{ background: colors.content, flex: 1, marginTop: 4 }}
              ></div>
            ),
          },
          {
            id: "hierarchy",
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
        ]}
      </PanelView>
    </div>
  );
}

export default App;
