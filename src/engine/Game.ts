import GameObject, { SerializedGameObject } from "./GameObject";
import Transform from "./behaviors/Transform";
import Input from "./Input";
import Behavior from "./Behavior";
import Camera from "./behaviors/Camera";
import Subscribable from "./Subscribable";
const behaviors = import.meta.glob("./behaviors/*.{ts,tsx}", { eager: true });
// console.log("base behaviors", behaviors);

type GameStats = {
  showFPS: boolean;
};

class Game extends Subscribable {
  static instance: Game | undefined;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameObjects: Map<string, GameObject> = new Map();
  scene: GameObject;
  turnIndex = 0;
  camera: GameObject | undefined;
  mainCamera: GameObject | undefined;
  editorCamera: GameObject | undefined;
  lastTime: number = 0;
  PPU: number = 1;
  scale: number = 4;
  isPlaying = false;
  behaviors: Record<string, new () => Behavior> = {};
  highResolution: boolean = false;
  selectedGameObject: GameObject | undefined;
  fps = 0;
  stats: GameStats = {
    showFPS: false,
  };

  constructor(
    width: number,
    height: number,
    PPU: number = 64,
    scale: number = 1
  ) {
    super();

    if (Game.instance) {
      throw new Error("Game already exists");
    }

    this.scene = new GameObject({ name: "Scene" });
    this.highResolution = window.devicePixelRatio > 1;
    this.scale = scale;
    this.PPU = PPU;

    this.canvas = document.createElement("canvas");
    this.canvas.width = width * (this.highResolution ? 2 : 1);
    this.canvas.height = height * (this.highResolution ? 2 : 1);
    this.canvas.style.backgroundColor = "black";
    this.canvas.style.imageRendering = "pixelated";

    // commenting out because it's handled by the css
    // this.canvas.style.width = `${width * this.scale}px`;
    // this.canvas.style.height = `${height * this.scale}px`;

    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;

    Input.getInstance().registerCanvas(this.canvas!);

    Game.instance = this;
    this.registerBehaviors(behaviors);

    this.editorCamera = new GameObject({
      name: "EditorCamera",
      behaviors: [
        new this.behaviors.Camera(),
        new this.behaviors.EditorCameraController(),
        new this.behaviors.WorldGridBehavior(),
      ],
    });
    this.editorCamera.behaviors.Transform.isLocked = true;
    this.camera = this.editorCamera;
  }

  // Add a method to resize the existing canvas
  public resizeCanvas(width: number, height: number) {
    if (!this.canvas) return;

    // get current vfov as a ratio of canvas height
    const currentVFOV = (this.editorCamera?.behaviors.Camera as Camera).vfov;
    const newVFOV = currentVFOV * (height / this.canvas.height);

    // Update canvas internal dimensions
    this.canvas.width = width * (this.highResolution ? 2 : 1);
    this.canvas.height = height * (this.highResolution ? 2 : 1);

    // Update canvas display size
    // commenting out because it's handled by the css
    // this.canvas.style.width = `${width * this.scale}px`;
    // this.canvas.style.height = `${height * this.scale}px`;

    // Reconfigure context settings
    this.ctx.imageSmoothingEnabled = false;

    // resize the camera vfov
    (this.editorCamera?.behaviors.Camera as Camera).vfov = newVFOV;
  }

  init() {
    if (!this.mainCamera) {
      const camera = new GameObject({
        name: "Camera",
        behaviors: [new this.behaviors.Camera()],
      });
      this.addGameObject(camera);
    }
  }

  loadScene(scene: SerializedGameObject) {
    this.stop();
    this.scene = GameObject.deserialize(scene);
    this.scene.behaviors.Transform.isLocked = true;
    this.selectedGameObject = undefined;
    this.scene.start();
    console.log("loaded scene", this.scene);
    this.updateSubscribers();
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
    Input.consumeScrollDelta();
    this.isPlaying = true;
    this.camera = this.mainCamera;
  }

  stop() {
    Input.consumeScrollDelta();
    this.isPlaying = false;
    this.camera = this.editorCamera;
  }

  tick = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds

    if (deltaTime > 0) {
      const fps = 1 / deltaTime;
      this.fps = lerp(this.fps, fps, 0.01);
      function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
      }
    }

    this.lastTime = currentTime;

    if (this.isPlaying) {
      this.update(deltaTime);
    }
    if (!this.isPlaying) {
      this.scene.updateEditor(deltaTime);
      this.editorCamera?.updateEditor(deltaTime);
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
      this.mainCamera = gameObject;
    }
    gameObject.game = this;
    this.scene.addChild(gameObject);
    this.gameObjects.set(gameObject.id, gameObject);
  }

  update(deltaTime: number) {
    this.scene.update(deltaTime);
  }

  draw() {
    this.ctx.fillStyle =
      this.camera?.behaviors.Camera?.backgroundColor || "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.camera) {
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      this.ctx.fillText("No camera found", 0, 10);
      return;
    }

    this.ctx.save();
    {
      const PPU = this.PPU * (this.highResolution ? 2 : 1);
      this.ctx.scale(PPU, PPU);
      this.ctx.lineWidth = 1 / PPU;
      this.ctx.font = `${12 / PPU}px Arial`;

      this.ctx.save();
      {
        const camera = Game.Camera as GameObject;
        const cameraBehavior = camera.behaviors.Camera as Camera;
        const cameraTransform = camera.behaviors.Transform as Transform;

        const scale = this.canvas.height / PPU / cameraBehavior.vfov;

        const snapToPixel = false;
        if (snapToPixel) {
          this.ctx.translate(
            Math.round(
              -cameraTransform.position.x * scale * PPU + this.canvas.width / 2
            ) / PPU,
            Math.round(
              -cameraTransform.position.y * scale * PPU + this.canvas.height / 2
            ) / PPU
          );
        } else {
          this.ctx.translate(
            this.canvas.width / PPU / 2,
            this.canvas.height / PPU / 2
          );
          this.ctx.rotate(-cameraTransform.rotation);
          this.ctx.translate(
            -cameraTransform.position.x * scale,
            -cameraTransform.position.y * scale
          );
        }

        this.ctx.scale(scale, scale);

        // we conditionally draw this because the game camera is in the scene and will get rendered by the
        // scene draw method, while the editor camera is outside the scene and needs to manually be called
        if (this.camera === this.editorCamera) {
          this.editorCamera?.drawWorldSpace();
        }

        this.scene.draw("default");
        if (this.isPlaying) this.scene.draw("editor");
        this.scene.drawWorldSpace();
      }
      this.ctx.restore();
    }
    this.ctx.restore();

    this.scene.drawScreenSpace();

    // draw fps
    this.drawStats();
  }

  drawStats() {
    let yPos = 24;
    const yDelta = 18;
    this.ctx.fillStyle = "white";
    this.ctx.font = `14px Arial`;

    // stat count
    const statCount = Object.keys(this.stats).reduce((acc, key) => {
      if (this.stats[key as keyof GameStats]) {
        acc++;
      }
      return acc;
    }, 0);

    if (statCount === 0) return;

    // draw box
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.beginPath();
    this.ctx.roundRect(4, 4, 128, yDelta * (statCount + 1) + 12, 4);
    this.ctx.fill();
    this.ctx.fillStyle = "white";

    // draw stats
    if (this.stats.showFPS) {
      this.ctx.fillText("Game Stats", 12, yPos);
      yPos += yDelta;
    }
    if (this.stats.showFPS) {
      this.ctx.fillText(`FPS: ${this.fps.toFixed(0)}`, 12, yPos);
      yPos += yDelta;
    }
  }

  static get Camera(): GameObject {
    if (!Game.instance?.camera) {
      throw new Error("Camera not found");
    }
    return Game.instance.camera;
  }
}

export default Game;
