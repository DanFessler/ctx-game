import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "./App.css";
import Game from "./engine/Game";
import PlayerCamera from "./example/objects/PlayerCamera";
import RedRectangle from "./example/objects/RedRectangle";
import TileMap from "./example/objects/TileMap";
import GameObject from "./engine/GameObject";
import { Transform } from "./engine/behaviors/Transform";

let game: Game;
if (!Game.instance) {
  game = new Game(1280, 720, 65, 1);
  game.addGameObject(new TileMap());
  game.addGameObject(new RedRectangle());
  game.addGameObject(new PlayerCamera());
  game.start();
} else {
  game = Game.instance;
}

function App() {
  const canvasContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasContainer.current) {
      canvasContainer.current.appendChild(game.canvas);
      console.log("appending canvas");
    }
  }, [canvasContainer]);

  return (
    <div>
      <div ref={canvasContainer}></div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          background: "gray",
        }}
      >
        {game.gameObjects.map((gameObject) => {
          return (
            <GameObjectTransform
              key={gameObject.name}
              gameObject={gameObject}
            />
          );
        })}
      </div>
    </div>
  );
}

function useGameObjectUpdate(gameObject: GameObject) {
  return useSyncExternalStore(
    (callback) => gameObject.subscribe(callback),
    () => gameObject.behaviors.Transform,
    () => gameObject.behaviors.Transform
  );
}

function GameObjectTransform({ gameObject }: { gameObject: GameObject }) {
  const gameObjectState = useGameObjectUpdate(gameObject);

  console.log(gameObject);
  const transform = gameObjectState as Transform;
  return (
    <div
      style={{
        padding: "8px",
        margin: "4px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        {gameObject.name}
      </div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <label>X:</label>
        <input
          type="number"
          value={transform.position.x}
          onChange={(e) => (transform.position.x = Number(e.target.value))}
          style={{ width: "60px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <label>Y:</label>
        <input
          type="number"
          value={transform.position.y}
          onChange={(e) => (transform.position.y = Number(e.target.value))}
          style={{ width: "60px" }}
        />
      </div>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <label>Rotation:</label>
        <input
          type="number"
          value={transform.rotation}
          onChange={(e) => (transform.rotation = Number(e.target.value))}
          style={{ width: "60px" }}
        />
      </div>
    </div>
  );
}

export default App;
