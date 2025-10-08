import { useEffect, useRef } from "react";
import { FaPlay, FaStop } from "react-icons/fa";

import game from "../../game";
import styles from "./SceneCanvas.module.css";

function SceneCanvas() {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = canvasContainer.current;
    if (!container) return;

    container.appendChild(game.canvas);
    game.canvas.style.display = "block";

    // Debounced resize function
    const debouncedResize = (width: number, height: number) => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Set a new timeout
      resizeTimeoutRef.current = setTimeout(() => {
        game.resizeCanvas(width, height);
      }, 10);
    };

    // Set up ResizeObserver to resize canvas when container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        // Calculate the actual pixel dimensions for the canvas
        const pixelWidth = Math.floor(width);
        const pixelHeight = Math.floor(height);

        // Use debounced resize
        debouncedResize(pixelWidth, pixelHeight);
      }
    });

    // Start observing the container
    resizeObserver.observe(container);

    return () => {
      // Clear any pending resize timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeObserver.disconnect();

      if (container.contains(game.canvas)) {
        container.removeChild(game.canvas);
      }
      game.canvas.style.display = "none";
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
