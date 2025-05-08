import { useState } from "react";
import colors from "../colors";
import styles from "./TabView.module.css";
import SortableItem from "../components/SortableItem";
import Tab from "./Tab";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

export type tabObject = {
  id: string;
  name: string;
  content: React.ReactNode;
  renderTabs?: boolean;
};

export type tabGroupObject = tabObject[];

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
        <SortableContext
          items={tabs.map((tab) => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {tabs.map((tab, index) => (
            <SortableItem key={tab.id} id={tab.id} type="tab">
              <Tab
                name={tab.name}
                selected={selectedTab === index}
                onClick={() => setSelectedTab(index)}
              />
            </SortableItem>
          ))}
        </SortableContext>
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
