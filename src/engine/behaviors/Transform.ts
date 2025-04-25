import Behavior from "../Behavior";
import Game from "../Game";

const DEBUG = false;

export class Transform extends Behavior {
  position: { x: number; y: number };
  size: { width: number; height: number };
  origin: { x: number; y: number };
  rotation: number;
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
    this.size = { width: w, height: h };
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
}
