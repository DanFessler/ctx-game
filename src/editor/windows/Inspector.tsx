import { useState, useEffect } from "react";

import GameObject from "../../engine/GameObject";
import Behavior from "../../engine/Behavior";
import colors from "../colors";
import { PiBoundingBoxFill } from "react-icons/pi";
import { FaCode } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import styles from "./Inspector.module.css";

function useGameObjejct(gameObject: GameObject) {
  const [, setCount] = useState(0);
  useEffect(() => {
    const unsubscribe = gameObject.subscribe(() => {
      setCount((count) => count + 1);
    });
    return () => unsubscribe();
  }, [gameObject]);
}

function Inspector({ gameObject }: { gameObject: GameObject }) {
  useGameObjejct(gameObject);

  const behaviors = gameObject.behaviors;

  return (
    <div className={styles.inspector}>
      <div
        className={styles.header}
        style={{
          // borderBottom: `1px solid ${colors.border}`,
          background: colors.headers,
        }}
      >
        <input
          type="checkbox"
          checked={gameObject.isActive}
          onChange={() => {
            gameObject.isActive = !gameObject.isActive;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <PiBoundingBoxFill style={{ width: "16px", height: "16px" }} />
        <input
          type="text"
          value={gameObject.name}
          onChange={(e) => {
            gameObject.name = e.target.value;
          }}
          className={styles.nameInput}
        />
      </div>
      <div
        style={{
          background: colors.content,
          flex: 1,
        }}
      >
        {Object.entries(behaviors).map(([key, behavior]) => {
          return <InspectorBehavior behavior={behavior} key={key} name={key} />;
        })}
      </div>
    </div>
  );
}

function InspectorBehavior({
  behavior,
  name,
}: {
  behavior: Behavior;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  function renderArrow() {
    if (behavior.inspector) {
      return <div className={styles.arrowContainer}>{isOpen ? "▼" : "▶"}</div>;
    }
    return null;
  }

  function renderCheckbox() {
    return (
      <input
        type="checkbox"
        checked={behavior.active}
        disabled={!behavior.canDisable}
        onChange={() => {
          behavior.gameObject!.updateSubscribers();
          behavior.active = !behavior.active;
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    );
  }

  return (
    <div
      className={styles.behaviorContainer}
      style={{
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div
        className={styles.behaviorHeader}
        style={{
          background: colors.headers,
        }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {renderCheckbox()}
        <FaCode />
        <div>{name}</div>
        <div className={styles.spacer} />
        {renderArrow()}
        <TiThMenu style={{ width: 14, height: 14 }} />
      </div>
      {behavior.inspector && isOpen ? (
        <div
          className={styles.behaviorContent}
          style={{ background: colors.content }}
        >
          <behavior.inspector
            refresh={() => {
              behavior.gameObject!.updateSubscribers();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Inspector;
