import Behavior from "../Behavior";
import Game from "../Game";
import { inspect } from "../serializable";

export class Camera extends Behavior {
  @inspect()
  public vfov: number;

  @inspect({ type: "color" })
  public backgroundColor: string = "#252627";

  constructor(args: Partial<Camera> = {}) {
    super(args);
    this.vfov = Game.instance!.canvas.height / Game.instance!.PPU;
  }

  start() {
    // whenever a camera gets started, set it to the main game camera. last one wins.
    // might need a smarter way to handle this in the future.
    Game.instance!.mainCamera = this.gameObject;
  }

  getCameraScale() {
    return Game.instance!.canvas.height / Game.instance!.PPU / this.vfov;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const aspectRatio = ctx.canvas.width / ctx.canvas.height;
    if (Game.instance!.selectedGameObject === this.gameObject) {
      const pixel = 1 / Game.instance!.PPU;
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        (-this.vfov / 2) * aspectRatio + pixel / 2,
        -this.vfov / 2 + pixel / 2,
        this.vfov * aspectRatio - pixel,
        this.vfov - pixel
      );
    }
  }
}

export default Camera;
