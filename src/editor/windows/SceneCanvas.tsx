import { useEffect, useRef } from "react";

import game from "../game";
import colors from "../colors";

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
      style={{
        flex: 1,
        background: colors.document,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        border: `3px solid ${colors.headers}`,
        borderRadius: "4px",
      }}
    />
  );
}

export default SceneCanvas;
