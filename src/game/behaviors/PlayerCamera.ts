import Transform from "../../engine/behaviors/Transform";
import Behavior from "../../engine/Behavior";
import Input from "../../engine/Input";
import Vector2 from "../../engine/Vector2";
import { inspect } from "../../engine/serializable";

class CameraController extends Behavior {
  @inspect()
  acceleration: number = 2;

  @inspect()
  maxSpeed: number = 5;

  @inspect()
  friction: number = 0.9;

  velocity: Vector2 = new Vector2(0, 0);

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
}

export default CameraController;
