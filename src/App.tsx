import { useEffect, useRef } from "react";
import "./App.css";
import Game from "./engine/Game";
import PlayerCamera from "./example/objects/PlayerCamera";
import RedRectangle from "./example/objects/RedRectangle";
import TileMap from "./example/objects/TileMap";

function App() {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    console.log("useEffect");
    if (canvasContainer.current) {
      let game = Game.instance;
      if (!game) {
        game = new Game(1280, 720, 65, 1);
        game.addGameObject(new TileMap());
        game.addGameObject(new RedRectangle());
        game.addGameObject(new PlayerCamera());
        // game.addGameObject(new WorldGrid());
        game.start();
      }

      gameRef.current = game;
      canvasContainer.current.appendChild(game.canvas);

      return () => {
        Game.instance = undefined;
        game.canvas.remove();
      };
    }
  }, [Game]);

  return <div ref={canvasContainer}></div>;
}

export default App;
