import { useState } from "react";
import GameObject from "../engine/GameObject";
import game from "../game";

import SceneHierarchy from "./windows/Hierarchy";
import SceneCanvas from "./windows/SceneCanvas";
import Inspector from "./windows/Inspector";
import PanelView, { panelObject, Window } from "./dockable/PanelView";

import "./App.css";

const panels: panelObject[] = [
  {
    panels: [
      {
        size: 2,
        panels: [
          {
            panels: [{ tabs: ["hierarchy"] }, { tabs: ["hierarchy"] }],
          },
          {
            size: 2,
            panels: [{ tabs: ["scene"] }],
          },
          {
            panels: [
              { tabs: ["inspector", "inspector", "inspector"] },
              { tabs: ["inspector"] },
              { tabs: ["inspector"] },
            ],
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
      <PanelView orientation="row" panels={panels}>
        <Window id="inspector" name="Inspector">
          <Inspector gameObject={selectedGameObject!} />
        </Window>
        <Window id="scene" name="Scene">
          <SceneCanvas />
        </Window>
        <Window id="game" name="Game">
          <div></div>
        </Window>
        <Window id="hierarchy" name="Hierarchy">
          <SceneHierarchy
            gameObjects={game.gameObjects}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        </Window>
      </PanelView>
    </div>
  );
}

export default App;
