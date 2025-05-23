import Behavior from "../Behavior";
import Game from "../Game";
import { inspect } from "../serializable";
import Vector2 from "../Vector2";

const DEBUG = false;

class Transform extends Behavior {
  @inspect()
  position: Vector2 = new Vector2(0, 0);

  @inspect()
  scale: Vector2 = new Vector2(1, 1);

  @inspect()
  rotation: number = 0;

  canDisable: boolean = false;

  gizmoScale: number = 1;

  constructor(args) {
    super(args);

    // event listeners for + and - to scale gizmo
    window.addEventListener("keydown", (e) => {
      if (e.key === "+" || e.key === "=") {
        this.gizmoScale *= 1.5;
      }
      if (e.key === "-") {
        this.gizmoScale /= 1.5;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    if (!DEBUG) return;
    if (renderPass !== "editor") return;

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(`x: ${this.position.x}, y: ${this.position.y}`, 0, 10);
  }

  // getWorldPosition() {
  //   const parent = this.gameObject?.parent;
  //   if (!parent) return this.position;
  //   const parentTransform = parent.behaviors.Transform as Transform;
  //   return parentTransform.position.add(this.position);
  // }

  getWorldTransform(): Transform {
    const parent = this.gameObject?.parent;
    if (!parent) return this;
    const parentTransform = parent.behaviors.Transform as Transform;
    return parentTransform.getWorldTransform().multiply(this);
  }

  multiply(other: Transform) {
    return new Transform({
      position: this.position.add(other.position),
      scale: this.scale.multiplyVec2(other.scale),
      rotation: this.rotation + other.rotation,
    });
  }

  drawWorldSpace(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "purple";

    const worldTransform = this.getWorldTransform();

    const scalar = (1 / Game.instance!.PPU) * this.gizmoScale;
    ctx.save();
    ctx.translate(worldTransform.position.x, worldTransform.position.y);
    // ctx.rotate(worldTransform.rotation); // this toggles localspace gizmo
    ctx.scale(scalar, scalar);

    const gizmoSize = 40;
    const arrowSize = 16;
    const lineWidth = 3;
    const dotSize = 6;

    // X-axis (red)
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = lineWidth;
    ctx.moveTo(0, 0);
    ctx.lineTo(gizmoSize - arrowSize, 0);
    ctx.stroke();

    // X arrow
    ctx.beginPath();
    ctx.moveTo(gizmoSize, 0);
    ctx.lineTo(gizmoSize - arrowSize, -arrowSize / 2);
    ctx.lineTo(gizmoSize - arrowSize, arrowSize / 2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    // Y-axis (green)
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -gizmoSize + arrowSize);
    ctx.stroke();

    // Y arrow
    ctx.beginPath();
    ctx.moveTo(0, -gizmoSize);
    ctx.lineTo(-arrowSize / 2, -gizmoSize + arrowSize);
    ctx.lineTo(arrowSize / 2, -gizmoSize + arrowSize);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();

    // Center point
    ctx.beginPath();
    ctx.arc(0, 0, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.restore();
  }
}

export default Transform;
