import { useEffect, useState } from "react";
import native from "../callNative";
import { FaFile } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
// import { Dirent } from "fs";

function AssetBrowser() {
  const [path, setPath] = useState(["src", "game"]);
  const [assets, setAssets] = useState<{ name: string; isFile: boolean }[]>([]);

  useEffect(() => {
    native.listDir(path.join("/")).then((assets) => {
      console.log(assets);
      setAssets(assets);
    });
  }, [path]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 8,
          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
          width: "100%",
        }}
      >
        {path.map((part, index) => (
          <div key={index} onClick={() => setPath(path.slice(0, index + 1))}>
            {index > 0 && <span style={{ padding: "0 5px" }}>{">"}</span>}
            {part}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          padding: 8,
        }}
      >
        {assets.map((asset, index) => (
          <div
            key={index}
            onDoubleClick={() => {
              if (!asset.isFile) setPath([...path, asset.name]);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 64,
              gap: 4,
              // height: 64,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: 1,
                // background: "black",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              {asset.isFile ? (
                <FaFile style={{ width: "100%", height: "100%" }} />
              ) : (
                <FaFolder style={{ width: "100%", height: "100%" }} />
              )}
            </div>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                // whiteSpace: "nowrap",
                width: "100%",
                height: 24,
                textAlign: "center",
              }}
            >
              {asset.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetBrowser;
