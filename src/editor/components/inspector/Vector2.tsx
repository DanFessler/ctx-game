type Vector2 = {
  x: number;
  y: number;
};

type Vector2InputProps = {
  label: string;
  value: Vector2;
  onChange: (value: Vector2) => void;
};

const styles: Record<string, React.CSSProperties> = {
  label: {
    position: "absolute",
    left: 4,
    // color: "rgba(255,255,255,0.25)",
    color: "rgba(128,128,128,0.75)",
    fontSize: 10,
  },
  inputContainer: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    position: "relative",
  },
  input: {
    width: "100%",
    paddingLeft: 16,
  },
};

function Vector2Input({ label, value, onChange }: Vector2InputProps) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    axis: "x" | "y"
  ) {
    if (axis === "x") {
      onChange({ x: Number(e.target.value), y: (value as Vector2).y });
    } else {
      onChange({ x: (value as Vector2).x, y: Number(e.target.value) });
    }
  }

  return (
    <>
      <label>{label}</label>
      <div style={styles.inputContainer}>
        <label style={styles.label}>X</label>
        <input
          type="number"
          value={(value as Vector2).x.toString()}
          onChange={(e) => handleChange(e, "x")}
          style={styles.input}
        />
      </div>
      <div style={styles.inputContainer}>
        <label style={styles.label}>Y</label>
        <input
          type="number"
          value={(value as Vector2).y.toString()}
          onChange={(e) => handleChange(e, "y")}
          style={styles.input}
        />
      </div>
    </>
  );
}

export default Vector2Input;
