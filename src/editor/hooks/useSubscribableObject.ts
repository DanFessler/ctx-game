import { useRef, useState, useEffect } from "react";
// import useGameObject from "./useGameObject";
// import GameObject from "../../engine/GameObject";

interface Subscribeable {
  subscribe: (callback: () => void) => () => void;
}

function useSubscribableObject<ObjectType extends Subscribeable, T>(
  object: ObjectType,
  selector: (object: ObjectType) => T,
  equalityFn: (a: T, b: T) => boolean = Object.is
): T {
  const [selected, setSelected] = useState(() => selector(object));
  const selectedRef = useRef(selected);

  useEffect(() => {
    if (!object) return;

    const checkForUpdates = () => {
      const next = selector(object);
      if (!equalityFn(selectedRef.current, next)) {
        selectedRef.current = next;
        setSelected(next);
      }
    };

    const unsubscribe = object.subscribe(checkForUpdates);
    return unsubscribe;
  }, [object, selector, equalityFn]);

  return selectedRef.current;
}

export default useSubscribableObject;
