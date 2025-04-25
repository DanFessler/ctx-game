import Behavior from "../Behavior";

export class Transform extends Behavior {
  position: { x: number; y: number };
  size: { width: number; height: number };
  constructor(x: number, y: number, w: number, h: number) {
    super();
    this.position = { x, y };
    this.size = { width: w, height: h };
  }
}
