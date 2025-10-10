import { useEffect, useState } from "react";
import native from "../callNative";
import styles from "./AssetBrowser.module.css";
import Game from "../../engine/Game";

// Icons
import { FaFile, FaFileCode, FaFileImage } from "react-icons/fa";
import { BsFilePlayFill } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

type File = {
  name: string;
  path: string;
  isDirectory: boolean;
  updatedAt: string;
  size: number;
  extension: string | undefined;
  subExtension: string | undefined;
  thumbnail: string | undefined;
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
      onClick={() => {
        // console.log({
        //   extension: asset.extension,
        //   subExtension: asset.subExtension,
        // });
      }}
      onDoubleClick={() => {
        if (asset.isDirectory) {
          setPath([...path, asset.name]);
          return;
        }

        switch (asset.extension) {
          case "json":
            native.readFile(asset.path).then((data) => {
              const parsed = JSON.parse(data);
              Game.instance!.loadScene(parsed);
            });
            break;
          default:
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
        <FileIcon file={asset} />
      </div>
      <div className={styles.fileName}>{asset.name.split(".")[0]}</div>
    </div>
  );
}

function FileIcon({ file }: { file: File }) {
  const { isDirectory, extension, subExtension, thumbnail } = file;

  function getFileIcon() {
    if (isDirectory) {
      return FaFolder;
    }

    switch (extension) {
      case "png":
        return FileThumbnailHOC(thumbnail);
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "tiff":
      case "ico":
      case "webp":
        // TODO: add other image extensions
        return FaFileImage;
      case "ts":
        return FaFileCode;
      case "json":
        switch (subExtension) {
          case "scene":
            return BsFilePlayFill;
          default:
            return FaFile;
        }
      default:
        return FaFile;
    }
  }

  const Icon = getFileIcon();
  return <Icon style={{ width: "100%", height: "100%" }} />;
}

function FileThumbnailHOC(thumbnail: string | undefined) {
  return function FileThumbnail({ style }: { style: React.CSSProperties }) {
    return (
      <img
        src={`data:image/png;base64,${thumbnail}`}
        style={{
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, .25)",
          ...style,
        }}
      />
    );
  };
}

export default AssetBrowser;
