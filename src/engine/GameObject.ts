import Game from "./Game";
import Behavior from "./Behavior";
import { Transform } from "./behaviors/Transform";

type GameObjectProps = {
  behaviors?: Behavior[];
  children?: GameObject[];
};

export class GameObject {
  // game: Game | undefined;
  behaviors: Record<string, Behavior> = {};
  children: GameObject[] = [];
  parent: GameObject | undefined;

  constructor({ behaviors, children }: GameObjectProps) {
    if (behaviors) {
      // Map behaviors to their constructor name
      this.behaviors = behaviors.reduce((acc, behavior) => {
        acc[behavior.constructor.name] = behavior;
        return acc;
      }, {} as Record<string, Behavior>);

      // add default transform if not present
      if (!this.behaviors.Transform) {
        this.behaviors.Transform = new Transform(0, 0, 0, 0);
      }

      // Set the gameObject and game properties for each behavior
      Object.values(this.behaviors).forEach((behavior) => {
        behavior.gameObject = this;
      });
    }

    if (children) {
      this.children = children;
      this.children.forEach((child) => {
        child.parent = this;
      });
    }
  }

  start() {
    Object.values(this.behaviors).forEach((behavior) => {
      behavior.ctx = Game.instance?.ctx;
      behavior.start();
    });
  }

  update(deltaTime: number) {
    Object.values(this.behaviors).forEach((behavior) => {
      behavior.update(deltaTime);
    });
    this.children.forEach((child) => {
      child.update(deltaTime);
    });
  }

  draw() {
    const ctx = Game.instance?.ctx;
    if (!ctx) return;

    const transform = this.behaviors.Transform as Transform;
    const snapToPixel = true;
    ctx.save();
    if (snapToPixel) {
      ctx.translate(
        Math.round(transform.position.x * Game.instance!.PPU) /
          Game.instance!.PPU,
        Math.round(transform.position.y * Game.instance!.PPU) /
          Game.instance!.PPU
      );
    } else {
      ctx.translate(transform.position.x, transform.position.y);
    }
    ctx.rotate(transform.rotation);
    ctx.save();
    ctx.translate(-transform.origin.x, -transform.origin.y);
    Object.values(this.behaviors).forEach((behavior) => {
      behavior.draw();
    });
    ctx.restore();
    this.children.forEach((child) => {
      child.draw();
    });
    ctx.restore();
  }

  addChild(child: GameObject) {
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child: GameObject) {
    this.children = this.children.filter((c) => c !== child);
    child.parent = undefined;
  }
}

export default GameObject;
