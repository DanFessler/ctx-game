import GameObject from "./GameObject";
import Camera from "./behaviors/Camera";
import { Transform } from "./behaviors/Transform";
import Input from "./Input";

class Game {
  static instance: Game | undefined;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameObjects: GameObject[] = [];
  turnIndex = 0;
  camera: GameObject | undefined;
  lastTime: number = 0;

  constructor(width: number, height: number) {
    if (Game.instance) {
      throw new Error("Game already exists");
    }

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = "white";
    this.ctx = this.canvas.getContext("2d")!;

    // Create a default camera game object
    const camera = new GameObject({
      behaviors: [new Transform(0, 0, 200, 200), new Camera()],
    });
    this.gameObjects.push(camera);
    this.camera = camera;

    Input.getInstance();

    Game.instance = this;
  }

  init() {}

  start() {
    this.init();
    this.gameObjects.forEach((gameObject) => {
      gameObject.start();
    });
    this.lastTime = performance.now();
    this.tick();
  }

  tick() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();
    requestAnimationFrame(() => this.tick());
  }

  addGameObject(gameObject: GameObject) {
    console.log("Adding game object", gameObject);
    if (gameObject.behaviors.Camera) {
      this.camera = gameObject;
      console.log("Camera set to", gameObject);
    }

    this.gameObjects.push(gameObject);
  }

  update(deltaTime: number) {
    this.gameObjects.forEach((gameObject) => {
      gameObject.update(deltaTime);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.camera) {
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      this.ctx.fillText("No camera found", 0, 10);
      return;
    }

    this.ctx.save();
    const cameraTransform = Game.Camera.behaviors.Transform as Transform;
    // console.log(cameraTransform);
    this.ctx.translate(
      Math.floor(-cameraTransform.position.x + this.canvas.width / 2),
      Math.floor(-cameraTransform.position.y + this.canvas.height / 2)
    );
    this.gameObjects.forEach((gameObject) => {
      gameObject.draw();
    });
    this.ctx.restore();
  }

  static get Camera(): GameObject {
    if (!Game.instance?.camera) {
      throw new Error("Camera not found");
    }
    return Game.instance.camera;
  }
}

export default Game;
