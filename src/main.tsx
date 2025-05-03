import "reflect-metadata";

import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Editor from "./editor";
import PanelGroup from "./panelgroup";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Test />
  </StrictMode>
);

const GAP = 4;

function Test() {
  return (
    <div
      style={{
        display: "flex",
        // gridTemplateColumns: widths,
        gap: GAP,
        minWidth: "100vw",
        width: "100vw",
        maxWidth: "100vw",
        height: "100vh",
      }}
    >
      <PanelGroup>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
      </PanelGroup>
    </div>
  );
}
