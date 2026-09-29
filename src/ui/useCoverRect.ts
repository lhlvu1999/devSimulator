import { useEffect, useState, type RefObject } from "react";
import type { Box } from "../content/sceneLayout";

export type PixelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Where a box inside a cover-fitted media element lands on screen.
 * The media is centered and cropped to fill the container, like CSS object-fit: cover.
 */
export function coverRect(
  container: { width: number; height: number },
  media: { width: number; height: number },
  box: Box,
): PixelRect {
  const scale = Math.max(
    container.width / media.width,
    container.height / media.height,
  );
  const shownWidth = media.width * scale;
  const shownHeight = media.height * scale;
  const offsetX = (container.width - shownWidth) / 2;
  const offsetY = (container.height - shownHeight) / 2;
  return {
    left: offsetX + (box.left / 100) * shownWidth,
    top: offsetY + (box.top / 100) * shownHeight,
    width: (box.width / 100) * shownWidth,
    height: (box.height / 100) * shownHeight,
  };
}

/** Tracks a cover-fitted box as the container resizes. */
export function useCoverRect(
  ref: RefObject<HTMLElement | null>,
  media: { width: number; height: number } | null,
  box: Box | null,
): PixelRect | null {
  const [rect, setRect] = useState<PixelRect | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !media || !box) {
      setRect(null);
      return;
    }
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      setRect(
        coverRect({ width: bounds.width, height: bounds.height }, media, box),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, media, box]);
  return rect;
}
