import { useState } from "react";
import Dockable, { useDockableLocalStorage } from "../../lib/dockable/Dockable";

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
    <Dockable.Root panels={layout} onChange={setLayout} gap={3} radius={4}>
      <Dockable.Panel>
        <Dockable.Window>
          <Dockable.View id="hierarchy" name="Hierarchy">
            <SceneHierarchy
              gameObjects={game.gameObjects}
              setSelectedGameObject={setSelectedGameObject}
              selectedGameObject={selectedGameObject}
            />
          </Dockable.View>
        </Dockable.Window>
      </Dockable.Panel>
      <Dockable.Panel size={3}>
        <Dockable.Window size={3}>
          <Dockable.View id="scene1" name="Scene">
            <SceneCanvas />
          </Dockable.View>
        </Dockable.Window>
        <Dockable.Window>
          <Dockable.View id="assets" name="Assets">
            <div></div>
          </Dockable.View>
        </Dockable.Window>
      </Dockable.Panel>
      <Dockable.Panel>
        <Dockable.Window>
          <Dockable.View id="inspector" name="Inspector">
            <Inspector gameObject={selectedGameObject!} />
          </Dockable.View>
          <Dockable.View id="inspector2" name="Inspector">
            <Inspector gameObject={selectedGameObject!} />
          </Dockable.View>
        </Dockable.Window>
        <Dockable.Window>
          <Dockable.View id="inspector3" name="Inspector">
            <Inspector gameObject={selectedGameObject!} />
          </Dockable.View>
        </Dockable.Window>
      </Dockable.Panel>
    </Dockable.Root>
  );
}

export default App;
