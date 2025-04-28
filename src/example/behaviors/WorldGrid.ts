// import Camera from "../../engine/behaviors/Camera";
import Behavior from "../../engine/Behavior";
import { Transform } from "../../engine/behaviors/Transform";
import Game from "../../engine/Game";

class WorldGridBehavior extends Behavior {
  spacing: number;

  constructor(spacing: number) {
    super();
    this.spacing = spacing;
  }

  draw() {
    const ctx = Game.instance?.ctx;
    if (!ctx) return;

    const transform = this.gameObject!.behaviors.Transform as Transform;
    const halfPixelOffset = 1 / Game.instance!.PPU / 2;
    const position = {
      x:
        Math.round(transform.position.x * Game.instance!.PPU) /
          Game.instance!.PPU +
        halfPixelOffset,
      y:
        Math.round(transform.position.y * Game.instance!.PPU) /
          Game.instance!.PPU +
        halfPixelOffset,
    };

    ctx.save();
    ctx.translate(-position.x, -position.y);

    // draw gridlines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.125)";
    const screenWidth = ctx.canvas.width;
    const screenHeight = ctx.canvas.height;
    const spacing = this.spacing;

    let lines = Math.ceil(screenWidth / 2 / spacing) * 2;
    for (let x = -lines / 2; x < lines; x += 1) {
      ctx.beginPath();
      const xPos = x * spacing + position.x;
      const modXPos = position.x % spacing;
      ctx.moveTo(xPos - modXPos, position.y - screenHeight / 2);
      ctx.lineTo(xPos - modXPos, screenHeight + position.y - screenHeight / 2);
      ctx.stroke();
    }

    lines = Math.ceil(screenHeight / 2 / spacing) * 2;
    for (let y = -lines / 2; y < lines; y += 1) {
      ctx.beginPath();
      const yPos = y * spacing + position.y;
      const modYPos = position.y % spacing;
      ctx.moveTo(position.x - screenWidth / 2, yPos - modYPos);
      ctx.lineTo(screenWidth + position.x - screenWidth / 2, yPos - modYPos);
      ctx.stroke();
    }

    // draw major axis
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();

    ctx.moveTo(position.x - position.x, position.y - screenHeight / 2);
    ctx.lineTo(
      position.x - position.x,
      screenHeight + position.y - screenHeight / 2
    );

    ctx.moveTo(position.x - screenWidth / 2, position.y - position.y);
    ctx.lineTo(
      screenWidth + position.x - screenWidth / 2,
      position.y - position.y
    );

    ctx.stroke();
    ctx.restore();
  }
}
export default WorldGridBehavior;
