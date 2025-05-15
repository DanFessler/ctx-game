import { useState } from "react";
import Dockable, {
  Panel,
  Window,
  View,
  useDockableLocalStorage,
} from "./dockable/dockable";

// Game engine related imports
import GameObject from "../engine/GameObject";
import game from "../game";
import SceneHierarchy from "./views/Hierarchy";
import SceneCanvas from "./views/SceneCanvas";
import Inspector from "./views/Inspector";

// styles
import "./App.css";

function App() {
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(game.gameObjects[0]);

  const { layout, setLayout } = useDockableLocalStorage(1);
  // const [layout, setLayout] = useState<ParsedNode[]>();
  // console.log("layout", JSON.stringify(layout, null, 2));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Dockable panels={layout} onChange={setLayout} gap={3} radius={4}>
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
