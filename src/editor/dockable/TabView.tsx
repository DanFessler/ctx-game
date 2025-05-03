import { useState } from "react";
import colors from "../colors";
import styles from "./TabView.module.css";

export type tabObject = {
  id: string;
  name: string;
  content: React.ReactNode;
};

export type tabGroupObject = tabObject[];

function TabView({ tabs }: { tabs: tabGroupObject }) {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div
      className={styles.container}
      style={{
        background: colors.headers,
        flex: 1,
      }}
    >
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
      {tabs[selectedTab].content}
    </div>
  );
}

export default TabView;
