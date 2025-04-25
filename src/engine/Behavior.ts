import { GameObject } from "./GameObject";
import Game from "./Game";

class Behavior {
  gameObject: GameObject | undefined;
  game: Game | undefined;
  ctx: CanvasRenderingContext2D | undefined;

  start() {}
  update() {}
  draw() {}
}

export default Behavior;
