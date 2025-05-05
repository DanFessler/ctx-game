import { useState } from "react";
import GameObject from "../engine/GameObject";
import game from "../game";

import SceneHierarchy from "./views/Hierarchy";
import SceneCanvas from "./views/SceneCanvas";
import Inspector from "./views/Inspector";
import Panel, { panelObject, View } from "./dockable/PanelView";
import Dockable from "./dockable/dockable";

import "./App.css";

const panels: panelObject[] = [
  {
    panels: [
      {
        size: 2,
        panels: [
          {
            panels: [{ tabs: ["hierarchy"] }],
          },
          {
            size: 2,
            panels: [{ tabs: ["scene"] }],
          },
          {
            panels: [{ tabs: ["inspector", "inspector"] }],
          },
        ],
      },
      {
        tabs: ["game"],
      },
    ],
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
        padding: 3,
      }}
    >
      <Dockable orientation="row" panels={panels}>
        <View id="inspector" name="Inspector">
          <Inspector gameObject={selectedGameObject!} />
        </View>
        <View id="scene" name="Scene">
          <SceneCanvas />
        </View>
        <View id="game" name="Game">
          <div></div>
        </View>
        <View id="hierarchy" name="Hierarchy">
          <SceneHierarchy
            gameObjects={game.gameObjects}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        </View>
      </Dockable>
    </div>
  );
}

export default App;
