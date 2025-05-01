import { useState } from "react";
import GameObject from "../engine/GameObject";
import HierarchyList from "./components/HierarchyList";
import TabView from "./components/TabView";

import SceneHierarchy from "./windows/Hierarchy";
import SceneCanvas from "./windows/SceneCanvas";
import Inspector from "./windows/Inspector";

import "./App.css";
import game from "./game";

// play stop icons
import { FaPlay, FaStop } from "react-icons/fa";

function App() {
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 1fr",
          justifyContent: "stretch",
          flex: 1,
          gap: "3px",
        }}
      >
        <TabView
          tabs={[
            {
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
        />

        <TabView
          tabs={[
            {
              name: "Scene",
              content: <SceneCanvas />,
            },
            {
              name: "Game",
              content: <div></div>,
            },
          ]}
        />

        <TabView
          tabs={[
            {
              name: "Inspector",
              content: selectedGameObject ? (
                <Inspector gameObject={selectedGameObject} />
              ) : null,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
