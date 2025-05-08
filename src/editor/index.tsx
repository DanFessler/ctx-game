import { useEffect, useRef, useState } from "react";
import GameObject from "../engine/GameObject";
import game from "../game";

import SceneHierarchy from "./views/Hierarchy";
import SceneCanvas from "./views/SceneCanvas";
import Inspector from "./views/Inspector";
import Dockable, { Panel, Window, View } from "./dockable/dockable";
import { ParsedNode } from "./dockable/serializeLayout";

import "./App.css";

function App() {
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(game.gameObjects[0]);

  // const savedLayout = localStorage.getItem("layout");
  // const [layout, setLayout] = useState<ParsedNode[]>(
  //   savedLayout ? JSON.parse(savedLayout) : undefined
  // );

  const [layout, setLayout] = useState<ParsedNode[]>();

  // save layout to local storage
  useEffect(() => {
    localStorage.setItem("layout", JSON.stringify(layout));
  }, [layout]);

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
      <Dockable panels={layout} onChange={setLayout} gap={3}>
        <Panel>
          <Window>
            <View id="hierarchy" name="Hierarchy">
              <SceneHierarchy
                gameObjects={game.gameObjects}
                setSelectedGameObject={setSelectedGameObject}
                selectedGameObject={selectedGameObject}
              />
            </View>
          </Window>
        </Panel>

        <Panel size={3}>
          <Window size={3}>
            <View id="scene1" name="Scene">
              <SceneCanvas />
            </View>
            <View id="scene2" name="Scene1">
              <SceneCanvas />
            </View>
            <View id="scene3" name="Scene2">
              <SceneCanvas />
            </View>
          </Window>
          <Window>
            <View id="assets" name="Assets">
              <div></div>
            </View>
          </Window>
        </Panel>

        <Panel>
          <Window>
            <View id="inspector" name="Inspector">
              <Inspector gameObject={selectedGameObject!} />
            </View>
            <View id="inspector2" name="Inspector">
              <Inspector gameObject={selectedGameObject!} />
            </View>
          </Window>
          <Window>
            <View id="inspector3" name="Inspector">
              <Inspector gameObject={selectedGameObject!} />
            </View>
          </Window>
        </Panel>
      </Dockable>
    </div>
  );
}

export default App;
