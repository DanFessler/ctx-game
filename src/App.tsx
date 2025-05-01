import { useEffect, useRef, useState } from "react";
import "./App.css";
import Game from "./engine/Game";
import PlayerCamera from "./example/objects/PlayerCamera";
import RedRectangle from "./example/objects/RedRectangle";
import TileMap from "./example/objects/TileMap";
import GameObject from "./engine/GameObject";
import Behavior from "./engine/Behavior";
import { PiBoundingBoxFill } from "react-icons/pi";
import { FaCode } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
// play stop icons
import { FaPlay, FaStop } from "react-icons/fa";

const colors = {
  headers: "rgb(70,70,70)",
  content: "rgb(64,64,64)",
  selected: "rgb(46,104,162)",
  background: "rgb(48,48,48)",
  document: "rgb(32,32,32)",
  border: "rgba(0,0,0,0.125)",
};

let game: Game;
if (!Game.instance) {
  game = new Game(960, 540, 64, 1);
  game.addGameObject(new TileMap());
  game.addGameObject(new RedRectangle());
  game.addGameObject(new PlayerCamera());
  game.start();
  game.play();
} else {
  game = Game.instance;
}

function App() {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [selectedGameObject, setSelectedGameObject] =
    useState<GameObject | null>(null);

  useEffect(() => {
    if (canvasContainer.current) {
      const container = canvasContainer.current;
      container.appendChild(game.canvas);
      game.canvas.style.display = "block";
      console.log("appending canvas");

      return () => {
        container.removeChild(game.canvas);
        game.canvas.style.display = "none";
        console.log("removing canvas");
      };
    }
  }, [canvasContainer]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        gap: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          padding: "4px",
          // background: colors.border,
        }}
      >
        <button onClick={() => game.play()}>
          <FaPlay />
        </button>
        <button onClick={() => game.stop()}>
          <FaStop />
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 1fr",
          justifyContent: "stretch",
          flex: 1,
          gap: "3px",
        }}
      >
        <TabView
          tabs={[
            {
              name: "Hierarchy",
              content: (
                <SceneHierarchy>
                  <HierarchyList
                    gameObjects={game.gameObjects}
                    setSelectedGameObject={setSelectedGameObject}
                    selectedGameObject={selectedGameObject}
                  />
                </SceneHierarchy>
              ),
            },
          ]}
        />

        <TabView
          tabs={[
            {
              name: "Scene",
              content: (
                <div
                  ref={canvasContainer}
                  style={{
                    flex: 1,
                    background: colors.document,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: `3px solid ${colors.content}`,
                    borderRadius: "4px",
                  }}
                ></div>
              ),
            },
            {
              name: "Game",
              content: <div></div>,
            },
          ]}
        />

        <TabView
          tabs={[
            {
              name: "Inspector",
              content: selectedGameObject ? (
                <Inspector gameObject={selectedGameObject} />
              ) : null,
            },
          ]}
        />
      </div>
    </div>
  );
}

function SceneHierarchy({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          background: colors.headers,
          padding: "6px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {/* header row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
            // padding: "4px",
          }}
        >
          <FaSearch style={{ width: "14px", height: "14px" }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              flex: 1,
              padding: "4px 6px",
              fontSize: "12px",
              // border: "1px solid " + colors.border,
              // borderRadius: "4px",
              // background: colors.content,
              // color: "inherit",
            }}
          />
        </div>
      </div>
      <div style={{ padding: "0px" }}>{children}</div>
    </div>
  );
}

function HierarchyList({
  gameObjects,
  setSelectedGameObject,
  selectedGameObject,
}: {
  gameObjects: GameObject[];
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | null;
}) {
  return (
    <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
      {gameObjects.map((gameObject) => {
        return (
          <HierarchyItem
            key={gameObject.name}
            gameObject={gameObject}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        );
      })}
    </ul>
  );
}

function HierarchyItem({
  gameObject,
  setSelectedGameObject,
  selectedGameObject,
}: {
  gameObject: GameObject;
  setSelectedGameObject: (gameObject: GameObject) => void;
  selectedGameObject: GameObject | null;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = gameObject.children.length > 0;

  function renderArrow() {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          width: "16px",
          position: "absolute",
          left: "8px",
        }}
      >
        {isOpen ? "▼" : "▶"}
      </div>
    );
  }

  return (
    <li>
      <div
        style={{
          position: "relative",
          padding: "4px 0 4px 24px",
          background:
            selectedGameObject === gameObject ? colors.selected : "transparent",
          // borderRadius: "4px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
          whiteSpace: "nowrap",
        }}
        onClick={() => setSelectedGameObject(gameObject)}
      >
        {hasChildren ? renderArrow() : null}
        <PiBoundingBoxFill />
        {gameObject.name}
      </div>
      {isOpen && hasChildren ? (
        <div style={{ marginLeft: "16px" }}>
          <HierarchyList
            gameObjects={gameObject.children}
            setSelectedGameObject={setSelectedGameObject}
            selectedGameObject={selectedGameObject}
          />
        </div>
      ) : null}
    </li>
  );
}

function useGameObjejct(gameObject: GameObject) {
  const [, setCount] = useState(0);
  useEffect(() => {
    const unsubscribe = gameObject.subscribe(() => {
      setCount((count) => count + 1);
    });
    return () => unsubscribe();
  }, [gameObject]);
}

function Inspector({ gameObject }: { gameObject: GameObject }) {
  useGameObjejct(gameObject);

  const behaviors = gameObject.behaviors;

  return (
    <div
      style={{
        boxSizing: "border-box",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          padding: "8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${colors.border}`,
          background: colors.headers,
        }}
      >
        <input
          type="checkbox"
          checked={gameObject.isActive}
          onChange={() => {
            gameObject.isActive = !gameObject.isActive;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <PiBoundingBoxFill style={{ width: "16px", height: "16px" }} />
        <input
          type="text"
          value={gameObject.name}
          onChange={(e) => {
            gameObject.name = e.target.value;
          }}
          style={{
            flex: 1,
            padding: "4px 6px",
          }}
        />
      </div>
      {Object.entries(behaviors).map(([key, behavior]) => {
        return <InspectorBehavior behavior={behavior} key={key} name={key} />;
      })}
    </div>
  );
}

function InspectorBehavior({
  behavior,
  name,
}: {
  behavior: Behavior;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  function renderArrow() {
    if (behavior.inspector) {
      return (
        <div
          style={{
            width: "16px",
            position: "absolute",
            right: "0",
          }}
        >
          {isOpen ? "▼" : "▶"}
        </div>
      );
    }
    return null;
  }

  return (
    <div
      style={{
        borderBottom: `1px solid ${colors.border}`,
        // padding: "8px",
        display: "flex",
        flexDirection: "column",
        // gap: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          fontWeight: "bold",
          alignItems: "center",
          gap: "6px",
          padding: "4px",
          background: colors.headers,
        }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <input
          type="checkbox"
          checked={behavior.active}
          disabled={!behavior.canDisable}
          onChange={() => {
            behavior.gameObject!.updateSubscribers();
            behavior.active = !behavior.active;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <FaCode />
        <div>{name}</div>
        {renderArrow()}
      </div>
      {behavior.inspector && isOpen ? (
        <div style={{ padding: "8px" }}>
          <behavior.inspector
            refresh={() => {
              behavior.gameObject!.updateSubscribers();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

type TabViewProps = {
  tabs: {
    name: string;
    content: React.ReactNode;
  }[];
};

function TabView({ tabs }: TabViewProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: colors.content,
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div style={{ background: colors.background }}>
        {tabs.map((tab, index) => (
          <span
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: "bold",
              background:
                selectedTab === index ? colors.headers : "transparent",
              padding: "8px 16px",
              lineHeight: "12px",
              borderRadius: "4px 4px 0 0",
              boxSizing: "border-box",
            }}
            onClick={() => {
              setSelectedTab(index);
            }}
          >
            {tab.name}
          </span>
        ))}
      </div>
      {tabs[selectedTab].content}
    </div>
  );
}

export default App;
