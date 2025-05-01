import Behavior from "../Behavior";
import Game from "../Game";

const DEBUG = false;

type Vector2 = {
  x: number;
  y: number;
};

export class Transform extends Behavior {
  position: Vector2;
  size: Vector2;
  origin: Vector2;
  rotation: number;
  canDisable: boolean = false;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    originX: number = 0,
    originY: number = 0,
    rotation: number = 0
  ) {
    super();
    this.position = { x, y };
    this.size = { x: w, y: h };
    this.origin = { x: originX, y: originY };
    this.rotation = rotation;
  }

  draw() {
    if (!DEBUG) return;

    const ctx = Game.instance?.ctx;
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(`x: ${this.position.x}, y: ${this.position.y}`, 0, 10);
  }

  inspector = (props: { refresh: () => void }) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          textAlign: "right",
          alignItems: "center",
        }}
      >
        <Vector2Input
          label="Position"
          value={this.position}
          onChange={(value: Vector2) => {
            this.position = value;
            props.refresh();
          }}
        />
        <Vector2Input
          label="Size"
          value={this.size}
          onChange={(value: Vector2) => {
            this.size = value;
            props.refresh();
          }}
        />
        <Vector2Input
          label="Origin"
          value={this.origin}
          onChange={(value: Vector2) => {
            this.origin = value;
            props.refresh();
          }}
        />
        <NumberInput
          label="Rotation"
          value={this.rotation}
          onChange={(value: number) => {
            this.rotation = value;
            props.refresh();
          }}
        />
      </div>
    );
  };
}

type NumberInputProps = {
  label: string;
  value: number | Vector2;
  onChange: (value: number) => void;
};

function NumberInput({ label, value, onChange }: NumberInputProps) {
  return (
    <>
      <label>{label}</label>
      <input
        type="number"
        value={value as number}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", boxSizing: "border-box", gridColumn: "span 2" }}
      />
    </>
  );
}

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
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <input
          type="number"
          value={(value as Vector2).x}
          onChange={(e) => handleChange(e, "x")}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <input
          type="number"
          value={(value as Vector2).y}
          onChange={(e) => handleChange(e, "y")}
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}
