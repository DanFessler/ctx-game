import { Transform } from "./Transform";
import Behavior from "../Behavior";

export class Rectangle extends Behavior {
  transform: Transform | undefined;
  color: string = "black";

  constructor(color: string = "black") {
    super();
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    const transform = this.gameObject!.behaviors.Transform as Transform;

    switch (renderPass) {
      case "Editor":
        ctx.strokeStyle = "rgb(0,255,0)";
        ctx.strokeRect(0, 0, transform.size.x, transform.size.y);
        break;
      default:
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, transform.size.x, transform.size.y);
        break;
    }
  }

  inspector = () => {
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <div>color:</div>
        <input
          type="color"
          value={this.color}
          onChange={(e) => {
            this.color = e.target.value;
          }}
        />
      </div>
    );
  };

  update() {
    // super.update();
    // const transform = this.gameObject!.behaviors.Transform as Transform;
    // transform.position.x += 1;
    // transform.position.y += 1;
  }
}
