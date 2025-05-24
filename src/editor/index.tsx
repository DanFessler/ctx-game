// import { useState } from "react";
import { Dockable, useDockableLocalStorage } from "@danfessler/react-dockable";
import "@danfessler/react-dockable/style.css";

// Game engine related imports
// import GameObject from "../engine/GameObject";
import game from "../game";
import SceneHierarchy from "./views/Hierarchy";
import SceneCanvas from "./views/SceneCanvas";
import Inspector from "./views/Inspector";

import "./App.css";
import AssetBrowser from "./views/AssetBrowser";
// import useGameObjectSelector from "./hooks/useGameObjectSelector";

function App() {
  // const [selectedGameObject, setSelectedGameObject] =
  //   useState<GameObject | null>(game.scene);

  // const selected = useGameObjectSelector(game, (go) => go.isSelected);

  const { layout, setLayout } = useDockableLocalStorage(3);

  // function handleSelectGameObject(gameObject: GameObject) {
  //   game.selectedGameObject = gameObject;
  // }

  return (
    <Dockable.Root
      layout={layout}
      onChange={setLayout}
      gap={3}
      radius={4}
      theme="dark"
    >
      <Dockable.Tab id="hierarchy" name="Hierarchy">
        <SceneHierarchy gameObject={game.scene} />
      </Dockable.Tab>
      <Dockable.Panel size={3}>
        <Dockable.Tab id="scene1" name="Scene">
          <SceneCanvas />
        </Dockable.Tab>
        <Dockable.Tab id="assets" name="Assets">
          <AssetBrowser />
        </Dockable.Tab>
      </Dockable.Panel>
      <Dockable.Tab id="inspector" name="Inspector">
        <Inspector />
      </Dockable.Tab>
    </Dockable.Root>
  );
}

export default App;
