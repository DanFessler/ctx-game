import { useState } from "react";
import colors from "../colors";
import styles from "./TabView.module.css";

export type tabObject = {
  name: string;
  content: React.ReactNode;
};

export type tabGroupObject = { [key: string]: tabObject };

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
        {Object.keys(tabs).map((tabId, index) => (
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
            {tabs[tabId].name}
          </span>
        ))}
      </div>
      {tabs[Object.keys(tabs)[selectedTab]].content}
    </div>
  );
}

export default TabView;
