import { useEffect, useState } from "react";
import {
  LAYOUT_KEY,
  loadSceneBoxes,
  type Box,
  type SceneBoxes,
} from "../content/sceneLayout";

export function useSceneLayout() {
  const [boxes, setBoxes] = useState<SceneBoxes>(loadSceneBoxes);
  useEffect(() => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(boxes));
  }, [boxes]);

  function edit(id: string, box: Box) {
    setBoxes((current) => ({ ...current, [id]: box }));
  }

  function reset() {
    localStorage.removeItem(LAYOUT_KEY);
    setBoxes(loadSceneBoxes());
  }

  return { boxes, edit, reset };
}
