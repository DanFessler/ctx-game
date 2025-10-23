import { Dockable, useDockableLocalStorage } from "@danfessler/react-dockable";
import "@danfessler/react-dockable/style.css";
import "./App.css";

import { viewManifest } from "./viewManifest";

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
      {Object.entries(viewManifest).map(([key, value]) => {
        return (
          <Dockable.Tab
            key={key}
            id={key}
            name={value.name}
            actions={value.actions || undefined}
          >
            <value.component />
          </Dockable.Tab>
        );
      })}
    </Dockable.Root>
  );
}

export default App;
