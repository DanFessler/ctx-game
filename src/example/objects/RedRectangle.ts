import Behavior from "../../engine/Behavior";
import { Rectangle } from "../../engine/behaviors/Rectangle";
import { Transform } from "../../engine/behaviors/Transform";
import Game from "../../engine/Game";
import GameObject from "../../engine/GameObject";
import Vector2 from "../../engine/Vector2";

class RedRectangleBehavior extends Behavior {
  camera: GameObject | undefined;
  start() {
    this.camera = Game.Camera;
  }
  update() {
    const transform = this.gameObject!.behaviors.Transform as Transform;
    const cameraTransform = this.camera?.behaviors.Transform as Transform;
    if (cameraTransform) {
      const direction = new Vector2(
        cameraTransform.position.x - transform.position.x,
        cameraTransform.position.y - transform.position.y
      );
      const distance = direction.magnitude;

      transform.position.x += direction.normalized.x * distance * 0.05;
      transform.position.y += direction.normalized.y * distance * 0.05;
      transform.rotation += 0.01;
    }
  }
}
class RedRectangle extends GameObject {
  constructor() {
    super({
      behaviors: [
        new Transform(0, 0, 3, 3, 1.5, 1.5),
        new Rectangle("red"),
        new RedRectangleBehavior(),
      ],
      children: [
        new GameObject({
          behaviors: [
            new Transform(0, 0, 1, 1, 0.5, 0.5),
            new Rectangle("blue"),
          ],
          name: "Blue Rectangle",
        }),
      ],
    });
  }
}

export default RedRectangle;
