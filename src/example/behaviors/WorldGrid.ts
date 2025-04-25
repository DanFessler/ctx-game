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
    const position = {
      x: Math.floor(transform.position.x),
      y: Math.floor(transform.position.y),
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
      const xPos = x * spacing + position.x + 0.5;
      const modXPos = position.x % spacing;
      ctx.moveTo(xPos - modXPos, position.y - screenHeight / 2);
      ctx.lineTo(xPos - modXPos, screenHeight + position.y - screenHeight / 2);
      ctx.stroke();
    }

    lines = Math.ceil(screenHeight / 2 / spacing) * 2;
    for (let y = -lines / 2; y < lines; y += 1) {
      ctx.beginPath();
      const yPos = y * spacing + position.y + 0.5;
      const modYPos = position.y % spacing;
      ctx.moveTo(position.x - screenWidth / 2, yPos - modYPos);
      ctx.lineTo(screenWidth + position.x - screenWidth / 2, yPos - modYPos);
      ctx.stroke();
    }

    // draw major axis
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();

    ctx.moveTo(position.x - position.x + 0.5, position.y - screenHeight / 2);
    ctx.lineTo(
      position.x - position.x + 0.5,
      screenHeight + position.y - screenHeight / 2
    );

    ctx.moveTo(position.x - screenWidth / 2, position.y - position.y + 0.5);
    ctx.lineTo(
      screenWidth + position.x - screenWidth / 2,
      position.y - position.y + 0.5
    );

    ctx.stroke();
    ctx.restore();
  }
}
export default WorldGridBehavior;
