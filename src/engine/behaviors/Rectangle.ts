import { Transform } from "./Transform";
import Behavior from "../Behavior";
import Game from "../Game";

export class Rectangle extends Behavior {
  transform: Transform | undefined;
  color: string = "black";

  constructor(color: string = "black") {
    super();
    this.color = color;
  }

  draw() {
    const ctx = Game.instance?.ctx;
    if (!ctx) return;

    const transform = this.gameObject!.behaviors.Transform as Transform;

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, transform.size.width, transform.size.height);
  }

  update() {
    // super.update();
    // const transform = this.gameObject!.behaviors.Transform as Transform;
    // transform.position.x += 1;
    // transform.position.y += 1;
  }
}
