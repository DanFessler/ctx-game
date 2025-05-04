import React from "react";
import PanelHandle from "./PanelHandle";

type PanelProps = {
  children: React.ReactNode;
  direction: "row" | "column";
  onDrag: (delta: { x: number; y: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  gap?: number;
};

function Panel(
  { children, direction, onDrag, onDragStart, onDragEnd, gap }: PanelProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 0 }}
    >
      <div
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          maxHeight: "100%",
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {children}
      </div>
      <PanelHandle
        direction={direction}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        gap={gap}
      />
    </div>
  );
}
const PanelForwardRef = React.forwardRef(Panel);

export default PanelForwardRef;
