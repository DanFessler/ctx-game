import styles from "./TabView.module.css";

function Tab({
  name,
  selected = true,
  onClick,
}: {
  name: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  const radius = 6;

  return (
    <span
      className={styles.tab + (selected ? " " + styles.selected : "")}
      onPointerDown={onClick}
    >
      {name}
      {selected && (
        <>
          <svg
            width={radius}
            height={radius}
            viewBox={`0 0 ${radius} ${radius}`}
            style={{
              position: "absolute",
              bottom: 0,
              right: `-${radius}px`,
            }}
          >
            <defs>
              <mask id="cornerMaskRight">
                <rect width={radius} height={radius} fill="white" />
                <circle cx={radius} cy="0" r={radius} fill="black" />
              </mask>
            </defs>
            <rect
              width={radius}
              height={radius}
              fill="var(--headers)"
              mask="url(#cornerMaskRight)"
            />
          </svg>
          <svg
            width={radius}
            height={radius}
            viewBox={`0 0 ${radius} ${radius}`}
            style={{
              position: "absolute",
              bottom: 0,
              left: `-${radius}px`,
            }}
          >
            <defs>
              <mask id="cornerMaskLeft">
                <rect width={radius} height={radius} fill="white" />
                <circle cx="0" cy="0" r={radius} fill="black" />
              </mask>
            </defs>
            <rect
              width={radius}
              height={radius}
              fill="var(--headers)"
              mask="url(#cornerMaskLeft)"
            />
          </svg>
        </>
      )}
    </span>
  );
}

export default Tab;
