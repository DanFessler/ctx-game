import { useState } from "react";
import colors from "../colors";
import styles from "./TabView.module.css";

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
        {tabs.map((tab, index) => (
          <span
            className={styles.tab}
            style={{
              background:
                selectedTab === index ? colors.headers : "transparent",
            }}
            onClick={() => {
              setSelectedTab(index);
            }}
          >
            {tab.name}
          </span>
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
