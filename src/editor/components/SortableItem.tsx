import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect } from "react";

export function SortableItem({
  id,
  children,
  type,
  style,
  onOver,
}: {
  id: string;
  children: React.ReactNode;
  type: "tab" | "behavior";
  style?: React.CSSProperties;
  onOver?: (isOver: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id, data: { type, children } });

  useEffect(() => {
    if (onOver) {
      onOver(isOver);
    }
  }, [isOver]);

  const itemStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...itemStyle, ...style }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default SortableItem;
