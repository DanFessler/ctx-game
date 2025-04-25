import Behavior from "../../engine/Behavior";
import { Rectangle } from "../../engine/behaviors/Rectangle";
import { Transform } from "../../engine/behaviors/Transform";
import Game from "../../engine/Game";
import GameObject from "../../engine/GameObject";

class RedRectangle extends GameObject {
  constructor() {
    super({
      behaviors: [
        new Transform(0, 0, 96, 96),
        new Rectangle("red"),
        new RedRectangleBehavior(),
      ],
      children: [
        new GameObject({
          behaviors: [new Transform(32, 32, 32, 32), new Rectangle("blue")],
        }),
      ],
    });
  }
}

class RedRectangleBehavior extends Behavior {
  camera: GameObject | undefined;
  start() {
    this.camera = Game.Camera;
  }
  update() {
    const transform = this.gameObject!.behaviors.Transform as Transform;
    const cameraTransform = this.camera?.behaviors.Transform as Transform;
    if (cameraTransform) {
      const directionX = cameraTransform.position.x - transform.position.x;
      const directionY = cameraTransform.position.y - transform.position.y;
      const length = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
      if (length > 0) {
        transform.position.x += (directionX / length) * 2;
        transform.position.y += (directionY / length) * 2;
      }
    }
  }
}

export default RedRectangle;
