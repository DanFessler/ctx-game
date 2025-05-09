import colors from "../colors";
import styles from "./TabView.module.css";
import SortableItem from "../components/SortableItem";
import Tab from "./Tab";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
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

function TabView({
  tabs,
  hideTabs = false,
  selected,
  id,
}: {
  tabs: tabGroupObject;
  hideTabs?: boolean;
  selected: string;
  id: string;
}) {
  // const [selectedTab, setSelectedTab] = useState(0);
  const { dispatch } = useDockable();

  function renderTabs() {
    return (
      <SortableContext
        items={tabs.map((tab) => tab.id)}
        strategy={horizontalListSortingStrategy}
      >
        <Droppable
          id={id}
          className={"DROPPABLE " + styles.tabBar}
          style={{
            background: colors.background,
            // borderBottom: `4px solid ${colors.headers}`,
          }}
        >
          {tabs.map((tab) => (
            <SortableItem
              key={tab.id}
              id={tab.id}
              type="tab"
              style={{
                flex: 1,
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
          {/* <div style={{ flex: 1 }} /> */}
          {/* <div
            style={{
              height: "100%",
              width: "24px",
              aspectRatio: 1,
              padding: 3,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TiThMenu style={{ width: 14, height: 14 }} />
          </div> */}
        </Droppable>
      </SortableContext>
    );
  }

  return (
    <div
      className={styles.container}
      style={{
        background: colors.headers,
        flex: 1,
      }}
    >
      {!hideTabs && renderTabs()}

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
    </div>
  );
}

function Droppable({
  id,
  style,
  className,
  children,
}: {
  id: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "tab-bar",
      accepts: ["tab"], // specify what types of items this droppable accepts
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        // Add visual feedback when dragging over
        // backgroundColor: isOver ? "RED" : "BLUE",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default TabView;
