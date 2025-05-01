import colors from "../colors";
import { FaSearch } from "react-icons/fa";

function SceneHierarchy({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          background: colors.headers,
          padding: "6px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FaSearch style={{ width: "14px", height: "14px" }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              flex: 1,
              padding: "4px 6px",
              fontSize: "12px",
            }}
          />
        </div>
      </div>
      <div style={{ padding: "0px" }}>{children}</div>
    </div>
  );
}

export default SceneHierarchy;
