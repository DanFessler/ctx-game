import React, { useState, useRef, useEffect, useCallback } from "react";
import Panel from "./Panel";

type PanelGroupProps = {
  children: React.ReactNode;
  direction: "row" | "column";
  initialSizes?: number[];
  gap?: number;
  onResizeEnd?: (sizes: number[]) => void;
  className?: string;
  handleClassName?: string;
  handleComponent?: React.ReactNode | ((index: number) => React.ReactNode);
};

function PanelGroup({
  children,
  direction,
  initialSizes,
  onResizeEnd,
  gap = 3,
  className,
  handleClassName,
  handleComponent,
}: PanelGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [sizes, setSizes] = useState<number[]>(
    initialSizes ||
      Array.from({ length: React.Children.count(children) }, () => 1)
  );
  const [pixelSizes, setPixelSizes] = useState<number[]>([]);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draggingDelta, setDraggingDelta] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const getPanelPixelSizes = useCallback(() => {
    return panelRefs.current
      .map((ref) => {
        if (!ref) return null;
        const rect = ref.getBoundingClientRect();
        return direction === "row" ? rect.width : rect.height;
      })
      .filter(Boolean) as number[];
  }, [direction, panelRefs]);

  const calcNewSizes = useCallback(() => {
    const panelPixelSizes = getPanelPixelSizes();
    const totalSize = panelPixelSizes.reduce((acc, size) => acc + size, 0);
    const newSizes = panelPixelSizes.map((size) => size / totalSize);
    return newSizes;
  }, [getPanelPixelSizes]);

  const childrenCount = React.Children.count(children);
  useEffect(() => {
    const newSizes = calcNewSizes();
    setSizes(newSizes);
  }, [childrenCount, calcNewSizes]);

  const handleDrag = (delta: { x: number; y: number }) => {
    setDraggingDelta(delta);
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
    setPixelSizes(getPanelPixelSizes());
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDraggingDelta(null);
    const newSizes = calcNewSizes();
    setSizes(newSizes);
    onResizeEnd?.(newSizes);
  };

  function getFrSizes() {
    if (draggingIndex === null || !draggingDelta)
      return sizes.map((size) => `${size}fr`).join(" ");

    const XorY = direction === "row" ? "x" : "y";

    return pixelSizes
      .map((size, index) => {
        if (index === draggingIndex) {
          return `${size + draggingDelta[XorY]}px`;
        }
        if (index === draggingIndex + 1) {
          return `${size - draggingDelta[XorY]}px`;
        }
        return `${size}px`;
      })
      .join(" ");
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "grid",
        [direction === "row" ? "gridTemplateColumns" : "gridTemplateRows"]:
          getFrSizes(),
        gap: gap,
        minWidth: "100%",
        width: "100%",
        minHeight: "100%",
        height: "100%",
        flex: 1,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <Panel
          ref={(el) => {
            panelRefs.current[index] = el;
          }}
          direction={direction}
          onDrag={(delta) => handleDrag(delta)}
          onDragStart={() => handleDragStart(index)}
          onDragEnd={() => handleDragEnd()}
          gap={gap}
          handleClassName={handleClassName}
          isLast={index === React.Children.count(children) - 1}
          handleComponent={
            typeof handleComponent === "function"
              ? handleComponent(index)
              : handleComponent
          }
        >
          {child}
        </Panel>
      ))}
    </div>
  );
}

export default PanelGroup;
