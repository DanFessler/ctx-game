import Camera from "../../engine/behaviors/Camera";
import { Transform } from "../../engine/behaviors/Transform";
import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";
import Input from "../../engine/Input";
import Vector2 from "../../engine/Vector2";
import Game from "../../engine/Game";
import WorldGrid from "../behaviors/WorldGrid";

class CameraController extends Behavior {
  acceleration: number = 100;
  velocity: Vector2 = new Vector2(0, 0);
  maxSpeed: number = 50;
  friction: number = 0.9;

  constructor() {
    super();
  }

  update(deltaTime: number) {
    // Get input
    if (Input.isKeyPressed("ArrowUp")) {
      this.velocity.y -= this.acceleration * deltaTime;
    }
    if (Input.isKeyPressed("ArrowDown")) {
      this.velocity.y += this.acceleration * deltaTime;
    }
    if (Input.isKeyPressed("ArrowLeft")) {
      this.velocity.x -= this.acceleration * deltaTime;
    }
    if (Input.isKeyPressed("ArrowRight")) {
      this.velocity.x += this.acceleration * deltaTime;
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

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.stroke();
  }
}

class PlayerCamera extends GameObject {
  constructor() {
    super({
      behaviors: [new Camera(), new CameraController(), new WorldGrid(100)],
    });
  }
}

export default PlayerCamera;
