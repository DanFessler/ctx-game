import React, { useState, useRef, useEffect, useCallback } from "react";
import Panel from "./Panel";

type PanelGroupProps = {
  children: React.ReactNode;
  direction: "row" | "column";
  sizes?: number[];
  gap?: number;
  onResizeEnd?: (sizes: number[]) => void;
  className?: string;
  handleClassName?: string;
  handleComponent?: React.ReactNode | ((index: number) => React.ReactNode);
};

function PanelGroup({
  children,
  direction,
  sizes,
  onResizeEnd,
  gap = 3,
  className,
  handleClassName,
  handleComponent,
}: PanelGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [_sizes, _setSizes] = useState<number[]>(
    sizes || Array.from({ length: React.Children.count(children) }, () => 1)
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

  // in an uncontrolled state, calculate new sizes when children count changes
  const childrenCount = React.Children.count(children);
  useEffect(() => {
    if (sizes) return; // if sizes are provided, don't calculate new sizes
    const newSizes = calcNewSizes();
    _setSizes(newSizes);
    onResizeEnd?.(newSizes);
  }, [childrenCount, calcNewSizes]);

  // keep sizes in sync with the provided sizes
  useEffect(() => {
    _setSizes(sizes || Array.from({ length: childrenCount }, () => 1));
  }, [sizes, childrenCount]);

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
    _setSizes(newSizes);
    onResizeEnd?.(newSizes);
  };

  function getFrSizes() {
    const XorY = direction === "row" ? "x" : "y";
    const maxDelta = {
      x: 32,
      y: 32,
    };

    // if we're not dragging, return the sizes as fr
    // we multiply by a constant because values under 1 might not fill the container
    // and multiplying proportionally has otherwise no effect on the size
    if (draggingIndex === null || !draggingDelta)
      return _sizes
        .map((size) => `minmax(${maxDelta[XorY]}px, ${100 * size}fr)`)
        .join(" ");

    // we adjust the drag delta so that the panels can't get too small
    const firstPanelSize = pixelSizes[draggingIndex] + draggingDelta[XorY];
    const firstPanelDifference =
      firstPanelSize < maxDelta[XorY] ? firstPanelSize - maxDelta[XorY] : 0;

    const secondPanelSize = pixelSizes[draggingIndex + 1] - draggingDelta[XorY];
    const secondPanelDifference =
      secondPanelSize < maxDelta[XorY] ? secondPanelSize - maxDelta[XorY] : 0;

    draggingDelta[XorY] =
      draggingDelta[XorY] - firstPanelDifference + secondPanelDifference;

    // when dragging, we return the sizes as px which are easier to work with
    return pixelSizes
      .map((size, index) => {
        if (index === draggingIndex) {
          return `minmax(${maxDelta[XorY]}px, ${size + draggingDelta[XorY]}px)`;
        }
        if (index === draggingIndex + 1) {
          return `minmax(${maxDelta[XorY]}px, ${size - draggingDelta[XorY]}px)`;
        }
        return `minmax(${maxDelta[XorY]}px, ${size}px)`;
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
