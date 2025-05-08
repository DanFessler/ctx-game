import { useState } from "react";
import colors from "../colors";
import styles from "./TabView.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export type tabObject = {
  id: string;
  name: string;
  content: React.ReactNode;
  renderTabs?: boolean;
};

export type tabGroupObject = tabObject[];

function Tab({
  name,
  selected,
  onClick,
  id,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  id: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, 0, 0)`,
      }
    : undefined;

  return (
    <span
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={styles.tab + (selected ? " " + styles.selected : "")}
      style={{
        background: selected ? colors.headers : "transparent",
        ...transformStyle,
      }}
      onClick={onClick}
    >
      {name}
    </span>
  );
}

function TabView({
  tabs,
  hideTabs = false,
}: {
  tabs: tabGroupObject;
  hideTabs?: boolean;
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  function renderTabs() {
    return (
      <div className={styles.tabBar} style={{ background: colors.background }}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}
            id={tab.id}
            name={tab.name}
            selected={selectedTab === index}
            onClick={() => setSelectedTab(index)}
          />
        ))}
      </div>
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
      <div style={{ overflow: "auto", display: "flex", flex: 1 }}>
        {tabs[selectedTab].content}
      </div>
    </div>
  );
}

export default TabView;
