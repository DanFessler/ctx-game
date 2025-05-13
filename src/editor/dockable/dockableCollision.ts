import {
  CollisionDetection,
  DroppableContainer,
  Collision,
  rectIntersection,
  closestCenter,
} from "@dnd-kit/core";

type DroppableType = "tab-bar" | "edge-zone" | "tab";

interface TypedDroppableData {
  type: DroppableType;
  [key: string]: unknown;
}

export const dockableCollision: CollisionDetection = ({
  active,
  collisionRect,
  droppableRects,
  droppableContainers,
  pointerCoordinates,
}): Collision[] => {
  const tabBarDroppables: DroppableContainer[] = [];
  const edgeZoneDroppables: DroppableContainer[] = [];

  for (const droppable of droppableContainers) {
    const data = droppable?.data?.current as TypedDroppableData | undefined;
    if (!data || !droppableRects.has(droppable.id)) continue;

    if (data.type === "tab-bar" || data.type === "tab") {
      tabBarDroppables.push(droppable);
    } else if (data.type === "edge-zone") {
      edgeZoneDroppables.push(droppable);
    }
  }

  const tabBarHits: Collision[] = rectIntersection({
    active,
    collisionRect,
    droppableRects,
    droppableContainers: tabBarDroppables,
    pointerCoordinates, // ✅ add this
  });

  if (tabBarHits.length > 0) {
    return tabBarHits;
  }

  const edgeZoneHits: Collision[] = closestCenter({
    active,
    collisionRect,
    droppableRects,
    droppableContainers: edgeZoneDroppables,
    pointerCoordinates, // ✅ also here
  });

  return edgeZoneHits;
};
