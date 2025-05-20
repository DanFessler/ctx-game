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
    useState<GameObject | null>(game.scene);

  const { layout, setLayout } = useDockableLocalStorage(3);
  // console.log("layout", JSON.stringify(layout, null, 2));

  return (
    <Dockable.Root
      layout={layout}
      onChange={setLayout}
      gap={3}
      radius={4}
      theme="dark"
    >
      <Dockable.Tab id="hierarchy" name="Hierarchy">
        <SceneHierarchy
          gameObject={game.scene}
          setSelectedGameObject={setSelectedGameObject}
          selectedGameObject={selectedGameObject}
        />
      </Dockable.Tab>
      <Dockable.Panel size={3}>
        <Dockable.Tab id="scene1" name="Scene">
          <SceneCanvas />
        </Dockable.Tab>
        <Dockable.Tab id="assets" name="Assets">
          <div></div>
        </Dockable.Tab>
      </Dockable.Panel>
      <Dockable.Tab id="inspector" name="Inspector">
        <Inspector gameObject={selectedGameObject!} />
      </Dockable.Tab>
    </Dockable.Root>
  );
}

export default App;
