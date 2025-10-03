// import Camera from "../../engine/behaviors/Camera";
import Behavior from "../Behavior";
import { Transform } from "./Transform";
import Game from "../Game";
import { inspect } from "../serializable";
import { Vector2 } from "../Vector2";
import CameraBehavior from "./Camera";

class WorldGridBehavior extends Behavior {
  @inspect({ type: "number", min: 1, max: 100 })
  spacing: number = 1;

  getScaledCanvasSize(ctx: CanvasRenderingContext2D) {
    const scale = Game.Camera.behaviors.Camera.getCameraScale();
    return new Vector2(
      ctx.canvas.width / Game.instance!.PPU,
      ctx.canvas.height / Game.instance!.PPU
    );
  }

  getWorldGridBounds(ctx: CanvasRenderingContext2D) {
    const scaledCanvasSize = this.getScaledCanvasSize(ctx);

    const topLeftWorldPosition =
      this.gameObject!.behaviors.Transform.screenToWorld(
        new Vector2(0, 0) //
      );
    const topRightWorldPosition =
      this.gameObject!.behaviors.Transform.screenToWorld(
        new Vector2(scaledCanvasSize.x, 0)
      );
    const bottomRightWorldPosition =
      this.gameObject!.behaviors.Transform.screenToWorld(
        new Vector2(scaledCanvasSize.x, scaledCanvasSize.y)
      );
    const bottomLeftWorldPosition =
      this.gameObject!.behaviors.Transform.screenToWorld(
        new Vector2(0, scaledCanvasSize.y)
      );

    return {
      x1: Math.min(
        topLeftWorldPosition.x,
        bottomRightWorldPosition.x,
        topRightWorldPosition.x,
        bottomLeftWorldPosition.x
      ),
      y1: Math.min(
        topLeftWorldPosition.y,
        bottomRightWorldPosition.y,
        topRightWorldPosition.y,
        bottomLeftWorldPosition.y
      ),
      x2: Math.max(
        topLeftWorldPosition.x,
        bottomRightWorldPosition.x,
        topRightWorldPosition.x,
        bottomLeftWorldPosition.x
      ),
      y2: Math.max(
        topLeftWorldPosition.y,
        bottomRightWorldPosition.y,
        topRightWorldPosition.y,
        bottomLeftWorldPosition.y
      ),
    };
  }

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    const cameraScale = (
      Game.Camera.behaviors.Camera as CameraBehavior
    ).getCameraScale();

    const PPU = Game.instance!.PPU;
    const linewidth = 1 / PPU / cameraScale;

    ctx.lineWidth = linewidth;

    const bounds = this.getWorldGridBounds(ctx);
    const minX = Math.floor(bounds.x1 / this.spacing) * this.spacing;
    const maxX = Math.max(bounds.x2 / this.spacing) * this.spacing;
    const minY = Math.floor(bounds.y1 / this.spacing) * this.spacing;
    const maxY = Math.max(bounds.y2 / this.spacing) * this.spacing;

    ctx.save();
    ctx.translate(linewidth / 2, linewidth / 2);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.125)";

    // draw the vertical lines
    for (let x = minX; x <= maxX; x += this.spacing) {
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
      ctx.stroke();
    }

    // draw the horizontal lines
    for (let y = minY; y <= maxY; y += this.spacing) {
      ctx.beginPath();
      ctx.moveTo(minX, y);
      ctx.lineTo(maxX, y);
      ctx.stroke();
    }

    // draw the major axis
    // ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = linewidth * 2;
    ctx.beginPath();
    ctx.moveTo(minX, 0);
    ctx.lineTo(maxX, 0);
    ctx.stroke();

    ctx.moveTo(0, minY);
    ctx.lineTo(0, maxY);
    ctx.stroke();

    ctx.restore();
  }
}

export default WorldGridBehavior;
