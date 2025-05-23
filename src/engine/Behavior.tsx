import "reflect-metadata";

import { Fragment } from "react";
import { GameObject } from "./GameObject";
import Game from "./Game";
import { getSerializableFields } from "./serializable";
import type { FieldMeta } from "./serializable";
import NumberInput from "../editor/components/inspector/Number";
import Vector2Input from "../editor/components/inspector/Vector2";
import ColorInput from "../editor/components/inspector/Color";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  start?(): void;
  update?(deltaTime: number): void;
  draw?(ctx: CanvasRenderingContext2D, renderPass?: string): void;
  drawEditor?(ctx: CanvasRenderingContext2D): void;

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

    if (!fields.length) {
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
        {fields.map(([key, meta]) => {
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
