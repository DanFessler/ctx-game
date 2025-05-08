import GameObject from "./GameObject";
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
  PPU: number = 1;
  scale: number = 4;
  isPlaying = false;

  constructor(
    width: number,
    height: number,
    PPU: number = 64,
    scale: number = 1
  ) {
    if (Game.instance) {
      throw new Error("Game already exists");
    }

    this.scale = scale;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = "black";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.style.width = `${width * this.scale}px`;
    this.canvas.style.height = `${height * this.scale}px`;

    this.PPU = PPU;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.scale(this.PPU, this.PPU);
    this.ctx.lineWidth = 1 / this.PPU;
    this.ctx.font = `${12 / this.PPU}px Arial`;
    this.ctx.imageSmoothingEnabled = false;

    Input.getInstance();
    Game.instance = this;
  }

  init() {}

  start() {
    // this.isPlaying = true;
    this.init();
    this.gameObjects.forEach((gameObject) => {
      gameObject.start();
    });
    this.lastTime = performance.now();
    this.tick();
  }

  play() {
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  tick = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    if (this.isPlaying) {
      this.update(deltaTime);
    }

    this.draw();
    requestAnimationFrame(() => this.tick());
  };

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
      if (gameObject.isActive) {
        gameObject.update(deltaTime);
      }
    });
  }

  draw() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width / this.PPU,
      this.canvas.height / this.PPU
    );

    if (!this.camera) {
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      this.ctx.fillText("No camera found", 0, 10);
      return;
    }

    this.ctx.save();
    const cameraTransform = Game.Camera.behaviors.Transform as Transform;
    // console.log(cameraTransform);

    const snapToPixel = true;
    if (snapToPixel) {
      this.ctx.translate(
        Math.round(
          -cameraTransform.position.x * this.PPU + this.canvas.width / 2
        ) / this.PPU,
        Math.round(
          -cameraTransform.position.y * this.PPU + this.canvas.height / 2
        ) / this.PPU
      );
    } else {
      this.ctx.translate(
        -cameraTransform.position.x + this.canvas.width / this.PPU / 2,
        -cameraTransform.position.y + this.canvas.height / this.PPU / 2
      );
    }
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.isActive) {
        gameObject.draw("default");
      }
    });
    this.gameObjects.forEach((gameObject) => {
      if (gameObject.isActive) {
        gameObject.draw("Editor");
      }
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
