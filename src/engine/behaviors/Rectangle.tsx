import { Transform } from "./Transform";
import Behavior from "../Behavior";
import { inspect } from "../serializable";

export class Rectangle extends Behavior {
  transform: Transform | undefined;

  @inspect({ type: "color" })
  color: string = "red";

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    const transform = this.gameObject!.behaviors.Transform as Transform;

    switch (renderPass) {
      case "editor":
        ctx.strokeStyle = "rgb(0,255,0)";
        ctx.strokeRect(0, 0, transform.scale.x, transform.scale.y);
        break;
      default:
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, transform.scale.x, transform.scale.y);
        break;
    }
  }

  update() {
    // super.update();
    // const transform = this.gameObject!.behaviors.Transform as Transform;
    // transform.position.x += 1;
    // transform.position.y += 1;
  }
}
