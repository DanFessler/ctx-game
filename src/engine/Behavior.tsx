import "reflect-metadata";

import { Fragment } from "react";
import { GameObject } from "./GameObject";
import Game from "./Game";
import { getSerializableFields } from "./serializable";
import type { FieldMeta } from "./serializable";
import NumberInput from "../editor/components/inspector/Number";
import Vector2Input from "../editor/components/inspector/Vector2";
import ColorInput from "../editor/components/inspector/Color";
import { nanoid } from "nanoid";

type Vector2 = {
  x: number;
  y: number;
};

abstract class Behavior {
  gameObject: GameObject | undefined;
  game: Game | undefined;
  ctx: CanvasRenderingContext2D | undefined;
  active = true;
  canDisable = true;
  id: string;
  initialFields?: Record<string, any> = undefined;

  constructor(properties?: Record<string, any>) {
    this.id = nanoid();
    this.initialFields = properties;
  }

  init(properties?: Record<string, any>) {
    if (!properties || Object.keys(properties).length === 0) {
      if (this.initialFields) {
        properties = this.initialFields;
      } else {
        return;
      }
    }

    const serializedFields = getSerializableFields(this);

    for (const [key, value] of Object.entries(properties)) {
      if (serializedFields[key]) {
        this[key] = value;
      } else {
        throw new Error(`Property ${key} is not a serialized field`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  start?(): void;
  update?(deltaTime: number): void;
  draw?(ctx: CanvasRenderingContext2D, renderPass?: string): void;
  drawEditor?(ctx: CanvasRenderingContext2D): void;

  serialize() {
    return {
      name: this.constructor.name,
      id: nanoid(),
      properties: getSerializableFields(this),
    };
  }

  inspector = ({ refresh }: { refresh: () => void }) => {
    const fields = getSerializableFields(this);

    const renderFieldType = (key: string, meta: FieldMeta) => {
      switch (meta.type) {
        case "number":
          return (
            <NumberInput
              label={key}
              value={this[key]}
              onChange={(value: number) => {
                this[key] = value;
                refresh();
              }}
            />
          );
        case "vector2":
          return (
            <Vector2Input
              label={key}
              value={this[key]}
              onChange={(value: Vector2) => {
                this[key] = value;
                refresh();
              }}
            />
          );
        case "color":
          return (
            <ColorInput
              label={key}
              value={this[key]}
              onChange={(value: string) => {
                this[key] = value;
                refresh();
              }}
            />
          );
        default:
          return null;
      }
    };

    if (Object.keys(fields).length === 0) {
      return (
        <div style={{ textAlign: "center", color: "gray" }}>No Inspector</div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          textAlign: "right",
          alignItems: "center",
        }}
      >
        {Object.entries(fields).map(([key, meta]) => {
          const keyString = String(key);
          return (
            <Fragment key={keyString}>
              {renderFieldType(keyString, meta)}
            </Fragment>
          );
        })}
      </div>
    );
  };
}

export default Behavior;
