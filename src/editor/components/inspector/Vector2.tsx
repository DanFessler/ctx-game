type Vector2 = {
  x: number;
  y: number;
};

type Vector2InputProps = {
  label: string;
  value: Vector2;
  onChange: (value: Vector2) => void;
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
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          position: "relative",
        }}
      >
        <label
          style={{
            position: "absolute",
            left: 4,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          X
        </label>
        <input
          type="number"
          value={(value as Vector2).x}
          onChange={(e) => handleChange(e, "x")}
          style={{ width: "100%", paddingLeft: 18 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          position: "relative",
        }}
      >
        <label
          style={{
            position: "absolute",
            left: 4,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Y
        </label>
        <input
          type="number"
          value={(value as Vector2).y}
          onChange={(e) => handleChange(e, "y")}
          style={{ width: "100%", paddingLeft: 18 }}
        />
      </div>
    </>
  );
}

export default Vector2Input;
