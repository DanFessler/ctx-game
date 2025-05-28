import { Dockable, useDockableLocalStorage } from "@danfessler/react-dockable";
import "@danfessler/react-dockable/style.css";

// Game engine related imports
import game from "../game";
import SceneHierarchy from "./views/Hierarchy";
import SceneCanvas from "./views/SceneCanvas";
import Inspector from "./views/Inspector";

import "./App.css";
import AssetBrowser from "./views/AssetBrowser";
import GameObject from "../engine/GameObject";
import native from "./callNative";

function App() {
  const { layout, setLayout } = useDockableLocalStorage(3);

  return (
    <Dockable.Root
      layout={layout}
      onChange={setLayout}
      gap={3}
      radius={4}
      theme="dark"
    >
      <Dockable.Tab
        id="hierarchy"
        name="Hierarchy"
        actions={[
          {
            items: [
              {
                label: "Save Scene",
                onClick: () => {
                  const serialized = game.scene.serialize();
                  native.saveFile(
                    "src/game/scenes/default.json",
                    JSON.stringify(serialized, null, 2)
                  );
                },
                shortcut: "⌘+S",
              },
              {
                label: "New GameObject",
                onClick: () => {
                  const newGameObject = new GameObject({
                    name: "New GameObject",
                  });
                  game.scene.addChild(newGameObject);
                  game.updateSubscribers();
                },
                shortcut: "⌘+S",
              },
            ],
          },
        ]}
      >
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
      <Dockable.Tab
        id="inspector"
        name="Inspector"
        actions={[
          {
            items: [
              {
                label: "Add Behavior",
                items: Object.entries(game.behaviors).map(([key]) => ({
                  label: key,
                  onClick: function () {
                    const behaviorClass = game.behaviors![key];
                    console.log(behaviorClass, game.selectedGameObject);
                    if (!behaviorClass || !game.selectedGameObject) return;
                    const behavior = new behaviorClass();
                    behavior.gameObject = game.selectedGameObject;
                    game.selectedGameObject.behaviors[key] = behavior;
                    game.selectedGameObject.updateSubscribers();
                  },
                })),
              },
            ],
          },
        ]}
      >
        <Inspector />
      </Dockable.Tab>
    </Dockable.Root>
  );
}

// const behaviorClass = behaviors![key];
// if (!behaviorClass) return;
// const behavior = new behaviorClass();
// behavior.gameObject = gameObject;
// gameObject.behaviors[key] = behavior;
// gameObject.updateSubscribers();
// console.log("adding behavior", behavior);

export default App;
