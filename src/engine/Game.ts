import GameObject, { SerializedGameObject } from "./GameObject";
import Transform from "./behaviors/Transform";
import Input from "./Input";
import Behavior from "./Behavior";
const behaviors = import.meta.glob("./behaviors/*.{ts,tsx}", { eager: true });
// console.log("base behaviors", behaviors);

class Game {
  static instance: Game | undefined;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  // gameObjects: GameObject[] = [];
  scene: GameObject;
  turnIndex = 0;
  camera: GameObject | undefined;
  lastTime: number = 0;
  PPU: number = 1;
  scale: number = 4;
  isPlaying = false;
  behaviors: Record<string, new () => Behavior> = {};
  highResolution: boolean = false;

  constructor(
    width: number,
    height: number,
    PPU: number = 64,
    scale: number = 1
  ) {
    if (Game.instance) {
      throw new Error("Game already exists");
    }

    this.scene = new GameObject({ name: "Scene" });

    this.highResolution = window.devicePixelRatio > 1;
    this.scale = scale;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width * (this.highResolution ? 2 : 1);
    this.canvas.height = height * (this.highResolution ? 2 : 1);
    this.canvas.style.backgroundColor = "black";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.style.width = `${width * this.scale}px`;
    this.canvas.style.height = `${height * this.scale}px`;
    this.PPU = PPU;

    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.scale(PPU, PPU);
    this.ctx.lineWidth = 1 / PPU;
    this.ctx.font = `${12 / PPU}px Arial`;
    this.ctx.imageSmoothingEnabled = false;

    Input.getInstance();
    Game.instance = this;
    this.registerBehaviors(behaviors);
  }

  init() {}

  loadScene(scene: SerializedGameObject) {
    this.scene = GameObject.deserialize(scene);
    console.log("loaded scene", this.scene);
  }

  serialize() {
    return this.scene?.serialize();
  }

  start() {
    // this.isPlaying = true;
    this.init();
    this.scene.start();
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
    if (!this.isPlaying) {
      this.scene.updateEditor(deltaTime);
    }

    this.draw();
    requestAnimationFrame(() => this.tick());
  };

  registerBehaviors(behaviors: Record<string, unknown>) {
    for (const path in behaviors) {
      const module = behaviors[path] as { default: new () => Behavior };
      const behavior = module.default;
      this.behaviors[behavior.name] = behavior;
    }
  }

  addGameObject(gameObject: GameObject) {
    if (gameObject.behaviors.Camera) {
      this.camera = gameObject;
    }
    this.scene.addChild(gameObject);
  }

  update(deltaTime: number) {
    this.scene.update(deltaTime);
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
    {
      if (this.highResolution) this.ctx.scale(2, 2);
      this.ctx.save();
      {
        const PPU = this.PPU * (this.highResolution ? 2 : 1);
        const cameraTransform = Game.Camera.behaviors.Transform as Transform;

        const snapToPixel = true;
        if (snapToPixel) {
          this.ctx.translate(
            Math.round(
              -cameraTransform.position.x * PPU + this.canvas.width / 2
            ) / PPU,
            Math.round(
              -cameraTransform.position.y * PPU + this.canvas.height / 2
            ) / PPU
          );
        } else {
          this.ctx.translate(
            -cameraTransform.position.x + this.canvas.width / PPU / 2,
            -cameraTransform.position.y + this.canvas.height / PPU / 2
          );
        }
        this.scene.draw("default");
        this.scene.draw("editor");
        this.scene.drawWorldSpace();
      }
      this.ctx.restore();
    }
    this.scene.drawScreenSpace();
    this.ctx.restore();
    // this.scene.drawScreenSpace(); // not implemented
  }

  static get Camera(): GameObject {
    if (!Game.instance?.camera) {
      throw new Error("Camera not found");
    }
    return Game.instance.camera;
  }
}

export default Game;
