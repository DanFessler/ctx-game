import { useEffect, useRef } from "react";

import game from "../../game";
import colors from "../colors";
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
    <div
      ref={canvasContainer}
      className={styles.container}
      style={{
        background: colors.document,
        border: `3px solid ${colors.headers}`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    />
  );
}

export default SceneCanvas;
