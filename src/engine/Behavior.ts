import { GameObject } from "./GameObject";
import Game from "./Game";

class Behavior {
  gameObject: GameObject | undefined;
  game: Game | undefined;
  ctx: CanvasRenderingContext2D | undefined;

  start() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(deltaTime: number) {}
  draw() {}
}

export default Behavior;
