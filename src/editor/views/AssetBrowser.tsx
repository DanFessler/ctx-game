import { useEffect, useState } from "react";
import native from "../callNative";
import { FaFile } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import styles from "./AssetBrowser.module.css";
import { FaAngleRight } from "react-icons/fa";

type File = {
  name: string;
  path: string;
  isDirectory: boolean;
  updatedAt: string;
  size: number;
};

function AssetBrowser() {
  const [path, setPath] = useState(["src", "game"]);
  const [assets, setAssets] = useState<File[]>([]);

  useEffect(() => {
    native.listDir(path.join("/")).then((assets) => {
      setAssets(assets);
    });
  }, [path]);

  return <FileBrowser files={assets} path={path} setPath={setPath} />;
}

type FileBrowserProps = {
  files: File[];
  path: string[];
  setPath: (path: string[]) => void;
};

function FileBrowser({ files, path, setPath }: FileBrowserProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [madWidth, setMadWidth] = useState(64);

  function handleFileSelect(file: File, e: React.MouseEvent<HTMLDivElement>) {
    if (e.shiftKey || e.ctrlKey) {
      const index = selectedFiles.findIndex((f) => f.path === file.path);
      const newSelectedFiles = [...selectedFiles];
      if (index === -1) {
        newSelectedFiles.push(file);
      } else {
        newSelectedFiles.splice(index, 1);
      }
      setSelectedFiles(newSelectedFiles);
    } else {
      //
      setSelectedFiles([file]);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.pathBar}>
        {path.map((part, index) => (
          <div
            key={index}
            onClick={() => setPath(path.slice(0, index + 1))}
            className={styles.pathBarItem}
          >
            {index > 0 && (
              <span className={styles.pathSeparator}>
                <FaAngleRight />
              </span>
            )}
            {part}
          </div>
        ))}
        <div className={styles.pathSpacer} />
        <div className={styles.pathBarInputContainer}>
          {/* <span style={{ fontSize: "10px" }}>a</span> */}
          <input
            className={styles.pathBarInput}
            type="range"
            min={32}
            max={96}
            value={madWidth}
            onChange={(e) => setMadWidth(parseInt(e.target.value))}
          />
          <span>aA</span>
        </div>
      </div>
      <div
        className={styles.gridContainer}
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${madWidth}px)`,
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedFiles([]);
          }
        }}
      >
        {files.map((asset, index) => (
          <File
            key={index}
            asset={asset}
            selected={selectedFiles.some((f) => f.path === asset.path)}
            handleFileSelect={handleFileSelect}
            path={path}
            setPath={setPath}
            madWidth={madWidth}
          />
        ))}
      </div>
    </div>
  );
}

function File({
  asset,
  selected,
  handleFileSelect,
  setPath,
  madWidth = 64,
  path,
}: {
  asset: File;
  selected: boolean;
  handleFileSelect: (file: File, e: React.MouseEvent<HTMLDivElement>) => void;
  path: string[];
  setPath: (path: string[]) => void;
  madWidth: number;
}) {
  return (
    <div
      onMouseDown={(e) => handleFileSelect(asset, e)}
      onDoubleClick={() => {
        if (asset.isDirectory) setPath([...path, asset.name]);
        else {
          native.openFile(asset.path);
        }
      }}
      className={styles.fileContainer}
      style={{
        width: madWidth,
        backgroundColor: selected
          ? "var(--dockable-colors-selected)"
          : "transparent",
      }}
    >
      <div className={styles.fileIcon}>
        {!asset.isDirectory ? (
          <FaFile style={{ width: "100%", height: "100%" }} />
        ) : (
          <FaFolder style={{ width: "100%", height: "100%" }} />
        )}
      </div>
      <div className={styles.fileName}>{asset.name}</div>
    </div>
  );
}

export default AssetBrowser;
