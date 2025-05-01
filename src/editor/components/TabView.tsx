import { useState } from "react";
import colors from "../colors";
import styles from "./TabView.module.css";

type TabViewProps = {
  tabs: {
    name: string;
    content: React.ReactNode;
  }[];
};

function TabView({ tabs }: TabViewProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div
      className={styles.container}
      style={{
        background: colors.headers,
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
