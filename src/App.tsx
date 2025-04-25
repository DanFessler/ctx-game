import { useEffect, useRef, useState } from "react";
import "./App.css";
import Game from "./engine/Game";
import PlayerCamera from "./example/objects/PlayerCamera";
import RedRectangle from "./example/objects/RedRectangle";

function App() {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect");
    if (canvasContainer.current) {
      let game = Game.instance;
      if (!game) {
        game = new Game(800, 600);
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

  return (
    <div ref={canvasContainer}>
      <h1>Hello World</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Count: {count}</p>
    </div>
  );
}

export default App;
