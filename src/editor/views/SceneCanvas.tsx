import { useEffect, useRef } from "react";
import { FaPlay, FaStop } from "react-icons/fa";

import game from "../../game";
import styles from "./SceneCanvas.module.css";
function SceneCanvas() {
  const canvasContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasContainer.current;
    if (!container) return;

    container.appendChild(game.canvas);
    game.canvas.style.display = "block";
    console.log("appending canvas");

    return () => {
      if (container.contains(game.canvas)) {
        container.removeChild(game.canvas);
      }
      game.canvas.style.display = "none";
      console.log("removing canvas");
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => game.play()}>
          <FaPlay />
        </button>
        <button onClick={() => game.stop()}>
          <FaStop />
        </button>
      </div>
      <div
        ref={canvasContainer}
        className={styles.canvasContainer}
        style={{ background: "var(--dockable-colors-document)" }}
      />
    </div>
  );
}

export default SceneCanvas;
