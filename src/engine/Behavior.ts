import { GameObject } from "./GameObject";
import Game from "./Game";

abstract class Behavior {
  gameObject: GameObject | undefined;
  game: Game | undefined;
  ctx: CanvasRenderingContext2D | undefined;
  active = true;
  canDisable = true;

  start?(): void;
  update?(deltaTime: number): void;
  draw?(ctx: CanvasRenderingContext2D, renderPass?: string): void;
  drawEditor?(ctx: CanvasRenderingContext2D): void;
  inspector?(props: { refresh: () => void }): React.ReactNode;
}

export default Behavior;
