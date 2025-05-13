import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({
  id,
  children,
  style,
  data,
}: {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  data?: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    // transition,
  } = useSortable({ id, data: { children, ...data } });

  const itemStyle = {
    transform: CSS.Translate.toString(transform),
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    // for whatever reason the transition breaks when using the supplied transition
    // this only happens when I use a dndkit hook in the parent component
    // transition,
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
