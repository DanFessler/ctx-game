import Behavior from "../Behavior";
import Game from "../Game";

export class Camera extends Behavior {
  start() {
    // whenever a camera gets started, set it to the main game camera. last one wins.
    // might need a smarter way to handle this in the future.
    Game.instance!.camera = this.gameObject;
  }
}

export default Camera;
