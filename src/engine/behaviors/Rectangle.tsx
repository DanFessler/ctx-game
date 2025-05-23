import Transform from "./Transform";
import Behavior from "../Behavior";
import { inspect } from "../serializable";
import Vector2 from "../Vector2";

class Rectangle extends Behavior {
  transform: Transform | undefined;

  @inspect()
  size: Vector2 = new Vector2(1, 1);

  @inspect()
  offset: Vector2 = new Vector2(0, 0);

  @inspect({ type: "color" })
  color: string = "red";

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    switch (renderPass) {
      case "editor":
        ctx.strokeStyle = "rgb(0,255,0)";
        ctx.strokeRect(this.offset.x, this.offset.y, this.size.x, this.size.y);
        break;
      default:
        ctx.fillStyle = this.color;
        ctx.fillRect(this.offset.x, this.offset.y, this.size.x, this.size.y);
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

export default Rectangle;
