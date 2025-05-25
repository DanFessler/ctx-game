import Behavior from "../Behavior";
import Game from "../Game";
import { inspect } from "../serializable";
import Vector2 from "../Vector2";
import Input from "../Input";

const DEBUG = false;

// gizmo size params
const gizmoSize = 30;
const arrowSize = 12;
const arrowLength = 8;
const lineWidth = 4;
const dotSize = 8;
const xColor = "255,0,0";
const yColor = "0,200,0";
const lineColor = "255,255,255";
const outlineColor = `rgba(0,0,0,0.25)`;

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
  static dragging: boolean = false;
  public currentState:
    | "deselected"
    | "selected"
    | "dragging"
    | "draggingY"
    | "draggingX"
    | "draggingRotation" = "deselected";
  public offset: Vector2 = new Vector2(0, 0);

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
    drawGizmo(
      ctx,
      this,
      this.gizmoScale,
      Game.instance?.selectedGameObject === this.gameObject ? true : false
    );
  }

  updateEditor() {
    const isOverGizmo = (position: Vector2) => {
      return (
        position.distanceTo(this.position) <
        (dotSize / Game.instance!.PPU) * this.gizmoScale
      );
    };

    const isOverArrow = (position: Vector2, axis: "x" | "y") => {
      const positive =
        position.distanceTo(
          this.position.add(
            (axis === "y"
              ? new Vector2(0, (30 / Game.instance!.PPU) * this.gizmoScale)
              : new Vector2((30 / Game.instance!.PPU) * this.gizmoScale, 0)
            ).rotate(this.rotation)
          )
        ) <
        (arrowLength / Game.instance!.PPU) * this.gizmoScale;
      const negative =
        position.distanceTo(
          this.position.add(
            (axis === "y"
              ? new Vector2(0, (-30 / Game.instance!.PPU) * this.gizmoScale)
              : new Vector2((-30 / Game.instance!.PPU) * this.gizmoScale, 0)
            ).rotate(this.rotation)
          )
        ) <
        (arrowLength / Game.instance!.PPU) * this.gizmoScale;
      return positive || negative;
    };

    const isOverRotationRing = (position: Vector2) => {
      const minRadius =
        ((gizmoSize - (arrowLength + 6) - 3) / Game.instance!.PPU) *
        this.gizmoScale;
      const maxRadius =
        ((gizmoSize - (arrowLength + 6) + 3) / Game.instance!.PPU) *
        this.gizmoScale;
      return (
        position.distanceTo(this.position) > minRadius &&
        position.distanceTo(this.position) < maxRadius
      );
    };

    switch (this.currentState) {
      case "deselected": {
        const localPosition = this.screenToLocal(Input.getMousePosition());
        const selectedObject = Game.instance?.selectedGameObject;
        if (
          !selectedObject &&
          isOverGizmo(localPosition) &&
          Input.isMouseDown(0)
        ) {
          Game.instance!.selectedGameObject = this.gameObject;
          Game.instance!.updateSubscribers();
          this.currentState = "selected";
        }

        // we have to consider the case where the selected object changes from outside the state machine
        if (selectedObject === this.gameObject) {
          this.currentState = "selected";
        }

        break;
      }

      case "selected": {
        const localPosition = this.screenToLocal(Input.getMousePosition());
        const selectedObject = Game.instance?.selectedGameObject;

        if (Input.isMouseDown(0)) {
          if (isOverGizmo(localPosition)) {
            this.currentState = "dragging";
            this.offset = localPosition.subtract(this.position);
          } else if (isOverArrow(localPosition, "y")) {
            this.currentState = "draggingY";
            this.offset = localPosition.subtract(this.position);
          } else if (isOverArrow(localPosition, "x")) {
            this.currentState = "draggingX";
            this.offset = localPosition.subtract(this.position);
          } else if (isOverRotationRing(localPosition)) {
            this.currentState = "draggingRotation";
            this.startRotation = this.rotation;
            this.offset = localPosition.subtract(this.position);
          } else {
            this.currentState = "deselected";
            Game.instance!.selectedGameObject = undefined;
            Game.instance!.updateSubscribers();
          }
        }

        // we have to consider the case where the selected object changes from outside the state machine
        if (selectedObject !== this.gameObject) {
          this.currentState = "deselected";
        }
        break;
      }

      case "dragging": {
        const localPosition = this.screenToLocal(
          Input.getMousePosition()
        ).subtract(this.offset);
        this.position.x = localPosition.x;
        this.position.y = localPosition.y;

        if (!Input.isMouseDown(0)) {
          this.currentState = "selected";
        }
        break;
      }

      case "draggingY": {
        const localPosition = this.screenToLocal(
          Input.getMousePosition()
        ).subtract(this.offset);
        const movement = localPosition.subtract(this.position);
        const localYAxis = Vector2.fromAngle(this.rotation + Math.PI / 2);
        const dotProduct = movement.dot(localYAxis);
        const projectedMovement = localYAxis.multiply(dotProduct);

        this.position = this.position.add(projectedMovement);

        if (!Input.isMouseDown(0)) {
          this.currentState = "selected";
        }
        break;
      }

      case "draggingX": {
        const localPosition = this.screenToLocal(
          Input.getMousePosition()
        ).subtract(this.offset);
        const movement = localPosition.subtract(this.position);
        const localXAxis = Vector2.fromAngle(this.rotation);
        const dotProduct = movement.dot(localXAxis);
        const projectedMovement = localXAxis.multiply(dotProduct);

        this.position = this.position.add(projectedMovement);

        if (!Input.isMouseDown(0)) {
          this.currentState = "selected";
        }
        break;
      }

      case "draggingRotation": {
        const startingPosition = this.offset;
        const currentPosition = this.screenToLocal(
          Input.getMousePosition()
        ).subtract(this.position);
        const angle = Vector2.angleBetween(startingPosition, currentPosition);
        this.rotation = this.startRotation + angle;

        if (!Input.isMouseDown(0)) {
          this.currentState = "selected";
        }
      }
    }
  }
}

function drawGizmo(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  gizmoScale: number,
  isSelected: boolean
) {
  const { position, rotation } = transform.getWorldTransform(transform);
  const scalar = (1 / Game.instance!.PPU) * gizmoScale;
  ctx.save();
  {
    ctx.translate(position.x, position.y); // translate to local position
    ctx.rotate(rotation); // toggle for local or world space
    ctx.scale(scalar, scalar); // inverse the PPU scaling to get back to pixel space (and scale the gizmo)

    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1 / Game.instance!.PPU / scalar;

    // Center point
    ctx.beginPath();
    ctx.arc(0, 0, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${lineColor},1)`;
    ctx.strokeStyle = outlineColor;
    ctx.stroke();
    ctx.fill();

    if (isSelected) {
      // X arrow
      ctx.beginPath();
      ctx.moveTo(gizmoSize, 0);
      ctx.lineTo(gizmoSize - arrowLength, -arrowSize / 2);
      ctx.lineTo(gizmoSize - arrowLength, arrowSize / 2);
      ctx.fillStyle = `rgba(${xColor},1)`;
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

      // X arrow (opposite)
      ctx.beginPath();
      ctx.moveTo(-gizmoSize, 0);
      ctx.lineTo(-gizmoSize + arrowLength, -arrowSize / 2);
      ctx.lineTo(-gizmoSize + arrowLength, arrowSize / 2);
      ctx.fillStyle = `rgba(${lineColor},0.5)`;
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

      // visualize click area of an arrow
      // ctx.moveTo(0, gizmoSize);
      // ctx.arc(0, gizmoSize, 10, 0, Math.PI * 2);
      // ctx.stroke();

      // rotation ring subtle outline
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        gizmoSize - (arrowLength + 6) + lineWidth / 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        gizmoSize - (arrowLength + 6) - lineWidth / 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // rotation ring
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `rgba(${lineColor},0.5)`;
      ctx.arc(0, 0, gizmoSize - (arrowLength + 6), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();

  // arc fill
  // TODO: this breaks when a child of a rotated parent
  ctx.save();
  {
    ctx.translate(position.x, position.y);
    ctx.scale(scalar, scalar);

    const delta = transform.rotation - transform.startRotation;
    // console.log(transform.rotation, transform.startRotation, delta);

    const [start, end] = [
      transform.offset.angle(),
      delta + transform.offset.angle(),
    ];

    // switch order if delta is negative
    // if (delta < 0) {
    //   [start, end] = [end, start];
    // }

    if (transform.currentState === "draggingRotation") {
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = `white`;
      ctx.arc(0, 0, gizmoSize - (arrowLength + 6), start, end);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export default Transform;
