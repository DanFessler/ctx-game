import Game from "./Game";
import Behavior from "./Behavior";
import { Transform } from "./behaviors/Transform";
import { nanoid } from "nanoid";

type GameObjectProps = {
  behaviors?: Behavior[];
  children?: GameObject[];
  name?: string;
};

type SerializedGameObject = {
  name: string;
  id: string;
  behaviors: SerializedBehavior[];
  children: SerializedGameObject[];
};

type SerializedBehavior = {
  name: string;
  properties: Record<string, unknown>;
};

export class GameObject {
  // game: Game | undefined;
  behaviors: Record<string, Behavior> = {};
  children: GameObject[] = [];
  parent: GameObject | undefined;
  name: string;
  isActive: boolean = true;
  id: string;

  private subscribers = new Set<() => void>();

  subscribe = (callback: () => void): (() => void) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  constructor({ behaviors, children, name }: GameObjectProps) {
    this.name = name || this.constructor.name;
    this.id = nanoid();

    if (behaviors) {
      // Map behaviors to their constructor name
      this.behaviors = behaviors.reduce((acc, behavior) => {
        acc[behavior.constructor.name] = behavior;
        return acc;
      }, {} as Record<string, Behavior>);

      // add default transform if not present
      // make sure it's the first behavior
      if (!this.behaviors.Transform) {
        this.behaviors = {
          Transform: new Transform(),
          ...this.behaviors,
        };
      }

      // Set the gameObject and game properties for each behavior
      Object.values(this.behaviors).forEach((behavior) => {
        behavior.gameObject = this;
        behavior.init();
      });
    } else {
      this.behaviors = {
        Transform: new Transform(),
      };
    }

    if (children) {
      this.children = children;
      this.children.forEach((child) => {
        child.parent = this;
      });
    }
  }

  serialize(): SerializedGameObject {
    return {
      name: this.name,
      id: this.id,
      behaviors: Object.values(this.behaviors).map((behavior) =>
        behavior.serialize()
      ),
      children: this.children.map((child) => child.serialize()),
    };
  }

  start() {
    Object.values(this.behaviors).forEach((behavior) => {
      behavior.ctx = Game.instance?.ctx;
      behavior.start?.();
    });
    this.children.forEach((child) => {
      child.start();
    });
  }

  update(deltaTime: number) {
    Object.values(this.behaviors).forEach((behavior) => {
      if (behavior.active) {
        behavior.update?.(deltaTime);
      }
    });
    this.children.forEach((child) => {
      child.update(deltaTime);
    });
    this.updateSubscribers();
  }

  updateSubscribers() {
    this.subscribers.forEach((callback) => callback());
  }

  draw(renderPass?: string) {
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
      if (behavior.active) {
        behavior.draw?.(ctx, renderPass);
      }
    });
    ctx.restore();
    this.children.forEach((child) => {
      child.draw(renderPass);
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
