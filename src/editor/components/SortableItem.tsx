import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({
  id,
  children,
  type,
  style,
}: {
  id: string;
  children: React.ReactNode;
  type: "tab" | "behavior";
  style?: React.CSSProperties;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { type, children } });

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
