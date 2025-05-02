import Behavior from "../Behavior";
import Game from "../Game";
import { inspect } from "../serializable";
import Vector2 from "../Vector2";

const DEBUG = false;

export class Transform extends Behavior {
  @inspect()
  position: Vector2;

  @inspect()
  scale: Vector2;

  @inspect()
  origin: Vector2;

  @inspect()
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
    this.position = new Vector2(x, y);
    this.scale = new Vector2(w, h);
    this.origin = new Vector2(originX, originY);
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
}
