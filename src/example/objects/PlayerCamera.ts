import Camera from "../../engine/behaviors/Camera";
import { Transform } from "../../engine/behaviors/Transform";
import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";
import Input from "../../engine/Input";
import Vector2 from "../../engine/Vector2";
import Game from "../../engine/Game";

class CameraController extends Behavior {
  acceleration: number = 2;
  velocity: Vector2 = new Vector2(0, 0);
  maxSpeed: number = 10;
  friction: number = 0.8;

  constructor() {
    super();
  }

  update() {
    // Get input
    if (Input.isKeyPressed("ArrowUp")) {
      this.velocity.y -= this.acceleration;
    }
    if (Input.isKeyPressed("ArrowDown")) {
      this.velocity.y += this.acceleration;
    }
    if (Input.isKeyPressed("ArrowLeft")) {
      this.velocity.x -= this.acceleration;
    }
    if (Input.isKeyPressed("ArrowRight")) {
      this.velocity.x += this.acceleration;
    }

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Clamp velocity to max speed
    this.velocity.x = Math.max(
      -this.maxSpeed,
      Math.min(this.maxSpeed, this.velocity.x)
    );
    this.velocity.y = Math.max(
      -this.maxSpeed,
      Math.min(this.maxSpeed, this.velocity.y)
    );

    // Update position
    const transform = this.gameObject!.behaviors.Transform as Transform;
    transform.position.x += this.velocity.x;
    transform.position.y += this.velocity.y;
  }

  draw() {
    const ctx = Game.instance?.ctx;
    if (!ctx) return;

    const transform = this.gameObject!.behaviors.Transform as Transform;
    ctx.save();
    ctx.translate(-transform.position.x, -transform.position.y);

    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(transform.position.x, transform.position.y - 5);
    ctx.lineTo(transform.position.x, transform.position.y + 5);
    ctx.moveTo(transform.position.x - 5, transform.position.y);
    ctx.lineTo(transform.position.x + 5, transform.position.y);
    ctx.stroke();

    // draw gridlines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.125)";
    const spacing = 32;
    const screenWidth = ctx.canvas.width;
    const screenHeight = ctx.canvas.height;

    let lines = Math.ceil(screenWidth / 2 / spacing) * 2;
    for (let x = -lines / 2; x < lines; x += 1) {
      ctx.beginPath();
      const xPos = x * spacing + transform.position.x;
      const modXPos = transform.position.x % spacing;
      ctx.moveTo(xPos - modXPos, transform.position.y - screenHeight / 2);
      ctx.lineTo(
        xPos - modXPos,
        screenHeight + transform.position.y - screenHeight / 2
      );
      ctx.stroke();
    }

    lines = Math.ceil(screenHeight / 2 / spacing) * 2;
    for (let y = -lines / 2; y < lines; y += 1) {
      ctx.beginPath();
      const yPos = y * spacing + transform.position.y;
      const modYPos = transform.position.y % spacing;
      ctx.moveTo(transform.position.x - screenWidth / 2, yPos - modYPos);
      ctx.lineTo(
        screenWidth + transform.position.x - screenWidth / 2,
        yPos - modYPos
      );
      ctx.stroke();
    }

    // draw major axis
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();

    ctx.moveTo(
      transform.position.x - transform.position.x,
      transform.position.y - screenHeight / 2
    );
    ctx.lineTo(
      transform.position.x - transform.position.x,
      screenHeight + transform.position.y - screenHeight / 2
    );

    ctx.moveTo(
      transform.position.x - screenWidth / 2,
      transform.position.y - transform.position.y
    );
    ctx.lineTo(
      screenWidth + transform.position.x - screenWidth / 2,
      transform.position.y - transform.position.y
    );

    ctx.stroke();
    ctx.restore();
  }
}

class PlayerCamera extends GameObject {
  constructor() {
    super({
      behaviors: [new Camera(), new CameraController()],
    });
  }
}

export default PlayerCamera;
