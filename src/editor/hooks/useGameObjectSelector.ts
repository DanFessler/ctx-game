import { useRef, useState, useEffect } from "react";
// import useGameObject from "./useGameObject";
// import GameObject from "../../engine/GameObject";

interface Subscribeable {
  subscribe: (callback: () => void) => () => void;
}

function useGameObjectSelector<T>(
  gameObject: Subscribeable,
  selector: (go: Subscribeable) => T,
  equalityFn: (a: T, b: T) => boolean = Object.is
): T {
  const [selected, setSelected] = useState(() => selector(gameObject));
  const selectedRef = useRef(selected);

  useEffect(() => {
    if (!gameObject) return;

    const checkForUpdates = () => {
      const next = selector(gameObject);
      if (!equalityFn(selectedRef.current, next)) {
        selectedRef.current = next;
        setSelected(next);
      }
    };

    const unsubscribe = gameObject.subscribe(checkForUpdates);
    return unsubscribe;
  }, [gameObject, selector, equalityFn]);

  return selectedRef.current;
}

export default useGameObjectSelector;
