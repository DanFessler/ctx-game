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
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
    opacity: isDragging ? 0 : 1,

    // for whatever reason the transition breaks when using the supplied transition
    // this only happens when I use a dndkit hook in the parent component.
    // supplying my own basic transition has weird edge cases, but it's better than nothing
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    // transition,
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
