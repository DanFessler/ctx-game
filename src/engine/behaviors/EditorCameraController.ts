import Transform from "./Transform";
import Behavior from "../Behavior";
import Input from "../Input";
import Vector2 from "../Vector2";
import { inspect } from "../serializable";
import Game from "../Game";

class EditorCameraController extends Behavior {
  @inspect()
  acceleration: number = 2;

  @inspect()
  maxSpeed: number = 5;

  @inspect()
  friction: number = 0.9;

  @inspect()
  scrollAcceleration: number = 10;

  @inspect()
  scrollMaxSpeed: number = 200;

  @inspect()
  scrollFriction: number = 0.85;

  isDragging = false;

  velocity: Vector2 = new Vector2(0, 0);
  scrollVelocity: number = 0;
  lastDragPosition: Vector2 = new Vector2(0, 0);

  updateEditor(deltaTime: number) {
    const cameraScale = Game.Camera.behaviors.Camera.getCameraScale();
    // Get input
    if (Input.isKeyPressed("ArrowUp")) {
      this.velocity.y -= (this.acceleration / cameraScale) * deltaTime;
    }
    if (Input.isKeyPressed("ArrowDown")) {
      this.velocity.y += (this.acceleration / cameraScale) * deltaTime;
    }
    if (Input.isKeyPressed("ArrowLeft")) {
      this.velocity.x -= (this.acceleration / cameraScale) * deltaTime;
    }
    if (Input.isKeyPressed("ArrowRight")) {
      this.velocity.x += (this.acceleration / cameraScale) * deltaTime;
    }

    // drag to move camera
    if (Input.isMouseDown(1) && !this.isDragging) {
      this.isDragging = true;
      this.lastDragPosition = Input.getMousePosition();
    }
    if (!Input.isMouseDown(1) && this.isDragging) {
      this.isDragging = false;
    }

    // scroll to zoom - accumulate velocity
    if (Input.getScrollDelta() !== 0) {
      const scrollDelta = Input.consumeScrollDelta();
      this.scrollVelocity -= scrollDelta * -this.scrollAcceleration * deltaTime;
    }

    if (this.isDragging) {
      const currentPosition = Input.getMousePosition();
      this.velocity.x =
        -(currentPosition.x - this.lastDragPosition.x) / cameraScale;
      this.velocity.y =
        -(currentPosition.y - this.lastDragPosition.y) / cameraScale;
      this.lastDragPosition = currentPosition;
    }

    // Apply friction
    if (!this.isDragging) {
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
    }

    // Apply scroll friction
    this.scrollVelocity *= this.scrollFriction;

    // Clamp velocity to max speed
    this.velocity.x = Math.max(
      -this.maxSpeed,
      Math.min(this.maxSpeed, this.velocity.x)
    );
    this.velocity.y = Math.max(
      -this.maxSpeed,
      Math.min(this.maxSpeed, this.velocity.y)
    );

    // Clamp scroll velocity to max speed
    this.scrollVelocity = Math.max(
      -this.scrollMaxSpeed,
      Math.min(this.scrollMaxSpeed, this.scrollVelocity)
    );

    // Update position
    const transform = this.gameObject!.behaviors.Transform as Transform;
    transform.position.x += this.velocity.x;
    transform.position.y += this.velocity.y;

    // Update camera zoom
    Game.Camera.behaviors.Camera.vfov *= 1 + this.scrollVelocity * deltaTime;

    // clamp vfov
    Game.Camera.behaviors.Camera.vfov = Math.max(
      1,
      Math.min(100, Game.Camera.behaviors.Camera.vfov)
    );
  }
}

export default EditorCameraController;
