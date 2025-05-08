import { useEffect, useRef, useState } from "react";

function useDragHandle() {
  const handleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!handleRef.current || !contentRef.current) return;

    const handle = handleRef.current;
    const content = contentRef.current;

    function handleMouseDown() {
      content.setAttribute("draggable", "true");
      setIsDragging(true);
    }

    function handleMouseUp() {
      content.removeAttribute("draggable");
      // setIsDragging(false);
    }

    function handleDragEnd() {
      content.removeAttribute("draggable");
    }

    handle.addEventListener("mousedown", handleMouseDown);
    handle.addEventListener("mouseup", handleMouseUp);
    content.addEventListener("dragend", handleDragEnd);

    return () => {
      handle.removeEventListener("mousedown", handleMouseDown);
      handle.removeEventListener("mouseup", handleMouseUp);
      content.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  return [handleRef, contentRef, isDragging];
}

export default useDragHandle;
