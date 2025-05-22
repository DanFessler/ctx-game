import Behavior from "../Behavior";
import { inspect } from "../serializable";
import Vector2 from "../Vector2";

const DEBUG = false;

class Transform extends Behavior {
  @inspect()
  position: Vector2 = new Vector2(0, 0);

  @inspect()
  scale: Vector2 = new Vector2(1, 1);

  @inspect()
  origin: Vector2 = new Vector2(0, 0);

  @inspect()
  rotation: number = 0;

  canDisable: boolean = false;

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    if (!DEBUG) return;
    if (renderPass !== "editor") return;

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(`x: ${this.position.x}, y: ${this.position.y}`, 0, 10);
  }
}

export default Transform;
