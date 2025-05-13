import colors from "../colors";
import styles from "./TabView.module.css";
import SortableItem from "../components/SortableItem";
import Droppable from "../components/Droppable";
import Tab from "./Tab";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { useDockable } from "./DockableContext";
export type tabObject = {
  id: string;
  name: string;
  content: React.ReactNode;
  renderTabs?: boolean;
};
// import { TiThMenu } from "react-icons/ti";
// import { IoMenu as TiThMenu } from "react-icons/io5";
import { HiDotsVertical as TiThMenu } from "react-icons/hi";

export type tabGroupObject = tabObject[];

type TabViewProps = {
  tabs: tabGroupObject;
  hideTabs?: boolean;
  selected: string;
  id: string;
  orientation: "row" | "column";
};
function TabView({
  tabs,
  hideTabs = false,
  selected,
  id,
  orientation,
}: TabViewProps) {
  const { active, over } = useDndContext();

  const overId =
    (over?.data?.current?.type === "tab" && over?.data?.current?.parentId) ||
    over?.id;

  const activeId =
    (active?.data?.current?.type === "tab" &&
      active?.data?.current?.parentId) ||
    active?.id;

  const currentEdgeZoneSide =
    over?.data?.current?.parentId == id && over?.data?.current?.side;
  console.log(overId, id, currentEdgeZoneSide, `margin${currentEdgeZoneSide}`);

  // flag for styling when dragging over the tab bar (but not it's own tabBar)
  // made slightly more verbose because we need to check if it's over a tab or the tabBar
  const isOverAny = overId == id && activeId !== id;

  return (
    <div
      className={`${styles.container} ${isOverAny ? styles.isOver : ""}`}
      style={{
        background: colors.headers,
        flex: 1,
        ...(currentEdgeZoneSide &&
          {
            // [`margin${currentEdgeZoneSide}`]: 64,
          }),
      }}
    >
      {!hideTabs && (
        <Droppable
          id={id}
          data={{
            type: "tab-bar",
          }}
          className={styles.tabBar}
          style={{
            background: colors.background,
          }}
        >
          <SortableTabs tabs={tabs} id={id} selected={selected} />
          <div style={{ flex: 1 }} />
          <div
            style={{
              height: "100%",
              width: "24px",
              aspectRatio: 1,
              padding: 3,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <TiThMenu style={{ width: 14, height: 14 }} />
          </div>
        </Droppable>
      )}

      <div
        style={{
          overflow: "auto",
          display: "flex",
          flex: 1,
          // background: colors.content,
        }}
      >
        {tabs.find((tab) => tab.id === selected)?.content}
      </div>

      <DroppableTargets
        id={id}
        currentEdge={currentEdgeZoneSide}
        orientation={orientation}
      />
    </div>
  );
}

type SortableTabsProps = {
  tabs: tabGroupObject;
  id: string;
  selected: string;
};
function SortableTabs({ tabs, id, selected }: SortableTabsProps) {
  const { dispatch } = useDockable();
  return (
    <SortableContext
      items={tabs.map((tab) => tab.id)}
      strategy={horizontalListSortingStrategy}
    >
      {tabs.map((tab) => (
        <SortableItem
          key={tab.id}
          id={tab.id}
          data={{
            type: "tab",
            parentId: id,
          }}
        >
          <Tab
            name={tab.name}
            selected={tab.id === selected}
            onClick={() =>
              dispatch({
                type: "selectTab",
                tabId: tab.id,
              })
            }
          />
        </SortableItem>
      ))}
    </SortableContext>
  );
}

type DroppableTargetsProps = {
  id: string;
  currentEdge: string;
  orientation: "row" | "column";
};
function DroppableTargets({
  id,
  currentEdge,
  orientation,
}: DroppableTargetsProps) {
  return (
    <>
      <Droppable
        className={[
          styles.edgeZone,
          styles.edgeZoneLeft,
          currentEdge === "Left" ? styles.edgeZoneHover : "",
        ].join(" ")}
        id={`${id}-split-left`}
        data={{
          type: "edge-zone",
          parentId: id,
          side: "Left",
        }}
      />
      <Droppable
        className={[
          styles.edgeZone,
          styles.edgeZoneRight,
          currentEdge === "Right" ? styles.edgeZoneHover : "",
        ].join(" ")}
        id={`${id}-split-right`}
        data={{
          type: "edge-zone",
          parentId: id,
          side: "Right",
        }}
      />
      <Droppable
        className={[
          styles.edgeZone,
          styles.edgeZoneTop,
          currentEdge === "Top" ? styles.edgeZoneHover : "",
        ].join(" ")}
        id={`${id}-split-top`}
        data={{
          type: "edge-zone",
          parentId: id,
          side: "Top",
        }}
      />
      <Droppable
        className={[
          styles.edgeZone,
          styles.edgeZoneBottom,
          currentEdge === "Bottom" ? styles.edgeZoneHover : "",
        ].join(" ")}
        id={`${id}-split-bottom`}
        data={{
          type: "edge-zone",
          parentId: id,
          side: "Bottom",
        }}
      />
    </>
  );
}

export default TabView;
