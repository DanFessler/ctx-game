import { useEffect, useState } from "react";
import GameObject from "../../engine/GameObject";

function useGameObject(gameObject: GameObject) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const unsubscribe = gameObject.subscribe(() => {
      setCount((count) => count + 1);
    });
    return () => unsubscribe();
  }, [gameObject]);

  return count;
}

export default useGameObject;
