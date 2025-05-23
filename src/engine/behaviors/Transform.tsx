import Behavior from "../Behavior";
import Game from "../Game";
import { inspect } from "../serializable";
import Vector2 from "../Vector2";

const DEBUG = false;

interface TransformData {
  position: Vector2;
  scale: Vector2;
  rotation: number;
}

class Transform extends Behavior implements TransformData {
  @inspect() position: Vector2 = new Vector2(0, 0);
  @inspect() scale: Vector2 = new Vector2(1, 1);
  @inspect() rotation: number = 0;
  canDisable: boolean = false;
  gizmoScale: number = 1;
  mousePosition: Vector2 = new Vector2(0, 0);
  mouseDown: boolean = false;
  draggingGizmo: boolean = false;

  constructor(args: Partial<Transform> = {}) {
    super(args);

    // event listeners for + and - to scale gizmo
    // TODO we need a cleanup function to avoid memory leaks
    window.addEventListener("keydown", (e) => {
      if (e.key === "+" || e.key === "=") {
        this.gizmoScale *= 1.5;
      }
      if (e.key === "-") {
        this.gizmoScale /= 1.5;
      }
      if (e.key === "0") {
        this.gizmoScale = 1;
      }
    });

    if (!Game.instance) return;
    const canvas = Game.instance!.canvas;
    window.addEventListener("mousemove", (e) => {
      const rect = Game.instance!.canvas.getBoundingClientRect();
      const relPos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
      this.mousePosition = relPos.divide(Game.instance!.PPU); // returns in scaled canvas units, not pixels
    });

    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.mouseDown = true;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.mouseDown = false;
        this.draggingGizmo = false;
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

  getWorldTransform(transform: Transform): {
    position: Vector2;
    rotation: number;
    scale: Vector2;
  } {
    if (!transform.gameObject?.parent) {
      return {
        position: transform.position,
        rotation: transform.rotation,
        scale: transform.scale,
      };
    }

    const parentWorld = this.getWorldTransform(
      transform.gameObject.parent.behaviors.Transform as Transform
    );

    return this.applyTransform(transform, parentWorld);
  }

  applyTransform(transform: Transform, parent: TransformData): TransformData {
    // 1. Scale local position by parent's scale
    const scaled = new Vector2(
      transform.position.x * parent.scale.x,
      transform.position.y * parent.scale.y
    );

    // 2. Rotate it by parent's rotation
    const rotated = scaled.rotate(parent.rotation);

    // 3. Add to parent's position
    const position = new Vector2(
      parent.position.x + rotated.x,
      parent.position.y + rotated.y
    );

    // 4. Compose rotation and scale
    const rotation = parent.rotation + transform.rotation;
    const scale = new Vector2(
      parent.scale.x * transform.scale.x,
      parent.scale.y * transform.scale.y
    );

    return { position, rotation, scale };
  }

  screenToWorld(position: Vector2): Vector2 {
    const canvas = Game.instance!.canvas;

    const canvasSize = new Vector2(canvas.width, canvas.height).divide(
      Game.instance!.highResolution ? 2 : 1
    );

    const relCenter = position
      .multiply(Game.instance!.PPU)
      .subtract(new Vector2(canvasSize.x / 2, canvasSize.y / 2));

    const camTransform = Game.Camera.behaviors.Transform as Transform;
    const scaledPosition = relCenter.divide(Game.instance!.PPU);
    return scaledPosition.add(camTransform.position);
  }

  worldToLocal(position: Vector2): Vector2 {
    if (!this.gameObject?.parent) {
      return position;
    }

    const parentWorld = this.getWorldTransform(
      this.gameObject.parent.behaviors.Transform as Transform
    );

    // 1. Subtract parent's position
    const relativePos = position.subtract(parentWorld.position);

    // 2. Rotate by negative parent rotation
    const unrotated = relativePos.rotate(-parentWorld.rotation);

    // 3. Divide by parent's scale
    const localPos = new Vector2(
      unrotated.x / parentWorld.scale.x,
      unrotated.y / parentWorld.scale.y
    );

    return localPos;
  }

  screenToLocal(position: Vector2): Vector2 {
    const worldPosition = this.screenToWorld(position);
    return this.worldToLocal(worldPosition);
  }

  multiply(other: Transform) {
    return new Transform({
      position: this.position.add(other.position),
      scale: this.scale.multiplyVec2(other.scale),
      rotation: this.rotation + other.rotation,
    });
  }

  drawWorldSpace(ctx: CanvasRenderingContext2D) {
    if (this.gameObject?.isSelected) {
      drawGizmo(ctx, this, this.gizmoScale);
    }
  }

  updateEditor() {
    if (!this.gameObject?.isSelected) return;
    if (this.mouseDown) {
      const localPosition = this.screenToLocal(this.mousePosition);

      if (localPosition.distanceTo(this.position) < 8 / Game.instance!.PPU) {
        this.draggingGizmo = true;
      }
      if (this.draggingGizmo) {
        this.position.x = localPosition.x;
        this.position.y = localPosition.y;
      }
    }
  }
}

function drawGizmo(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  gizmoScale: number
) {
  const { position, rotation } = transform.getWorldTransform(transform);
  const scalar = (1 / Game.instance!.PPU) * gizmoScale;
  ctx.save();

  ctx.translate(position.x, position.y); // translate to local position
  ctx.rotate(rotation); // toggle for local or world space
  ctx.scale(scalar, scalar); // inverse the PPU scaling to get back to pixel space (and scale the gizmo)

  // gizmo size params
  const gizmoSize = 30;
  const arrowSize = 12;
  const arrowLength = 8;
  const lineWidth = 3;
  const dotSize = 8;

  const xColor = "255,0,0";
  const yColor = "0,200,0";
  const lineColor = "255,255,255";

  ctx.strokeStyle = `rgba(0,0,0,0.25)`;
  ctx.lineWidth = 1 / Game.instance!.PPU / scalar;

  // X arrow
  ctx.beginPath();
  ctx.moveTo(gizmoSize, 0);
  ctx.lineTo(gizmoSize - arrowLength, -arrowSize / 2);
  ctx.lineTo(gizmoSize - arrowLength, arrowSize / 2);
  ctx.fillStyle = `rgba(${xColor},1)`;
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // X arrow (opposite)
  ctx.beginPath();
  ctx.moveTo(-gizmoSize, 0);
  ctx.lineTo(-gizmoSize + arrowLength, -arrowSize / 2);
  ctx.lineTo(-gizmoSize + arrowLength, arrowSize / 2);
  ctx.fillStyle = `rgba(${lineColor},0.5)`;
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // Y arrow
  ctx.beginPath();
  ctx.moveTo(0, gizmoSize);
  ctx.lineTo(-arrowSize / 2, gizmoSize - arrowLength);
  ctx.lineTo(arrowSize / 2, gizmoSize - arrowLength);
  ctx.fillStyle = `rgba(${yColor},1)`;
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // Y arrow (opposite)
  ctx.beginPath();
  ctx.moveTo(0, -gizmoSize);
  ctx.lineTo(-arrowSize / 2, -gizmoSize + arrowLength);
  ctx.lineTo(arrowSize / 2, -gizmoSize + arrowLength);
  ctx.fillStyle = `rgba(${lineColor},0.5)`;
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // Center point
  ctx.beginPath();
  ctx.arc(0, 0, dotSize, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${lineColor},1)`;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, gizmoSize - (arrowLength + 6) + lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, gizmoSize - (arrowLength + 6) - lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = `rgba(${lineColor},0.5)`;
  ctx.arc(0, 0, gizmoSize - (arrowLength + 6), 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

export default Transform;
