import { useState } from "react";
import { Dockable, useDockableLocalStorage } from "@danfessler/react-dockable";
import "@danfessler/react-dockable/style.css";

// Game engine related imports
import GameObject from "../engine/GameObject";
import game from "../game";
import SceneHierarchy from "./views/Hierarchy";
import SceneCanvas from "./views/SceneCanvas";
import Inspector from "./views/Inspector";

import "./App.css";

function App() {
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(game.gameObjects[0]);

  const { layout, setLayout } = useDockableLocalStorage(2);
  // console.log("layout", JSON.stringify(layout, null, 2));

  return (
    <Dockable.Root
      layout={layout}
      onChange={setLayout}
      gap={3}
      radius={4}
      theme="dark"
    >
      <Dockable.Panel>
        <Dockable.Window>
          <Dockable.Tab id="hierarchy" name="Hierarchy">
            <SceneHierarchy
              gameObjects={game.gameObjects}
              setSelectedGameObject={setSelectedGameObject}
              selectedGameObject={selectedGameObject}
            />
          </Dockable.Tab>
        </Dockable.Window>
      </Dockable.Panel>
      <Dockable.Panel size={3}>
        <Dockable.Window size={3}>
          <Dockable.Tab id="scene1" name="Scene">
            <SceneCanvas />
          </Dockable.Tab>
        </Dockable.Window>
        <Dockable.Window>
          <Dockable.Tab id="assets" name="Assets">
            <div></div>
          </Dockable.Tab>
        </Dockable.Window>
      </Dockable.Panel>
      <Dockable.Panel>
        <Dockable.Window>
          <Dockable.Tab id="inspector" name="Inspector">
            <Inspector gameObject={selectedGameObject!} />
          </Dockable.Tab>
          <Dockable.Tab id="inspector2" name="Inspector">
            <Inspector gameObject={selectedGameObject!} />
          </Dockable.Tab>
        </Dockable.Window>
        <Dockable.Window>
          <Dockable.Tab id="inspector3" name="Inspector">
            <Inspector gameObject={selectedGameObject!} />
          </Dockable.Tab>
        </Dockable.Window>
      </Dockable.Panel>
    </Dockable.Root>
  );
}

export default App;
