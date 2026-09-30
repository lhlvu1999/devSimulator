import { useEffect, useState, type RefObject } from "react";
import type { Box } from "../content/sceneLayout";

export type PixelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Where a box inside a media element lands on screen when the whole frame is shown,
 * like CSS object-fit: contain with object-position: center bottom.
 * Nothing is cropped; spare space sits above the frame, or evenly on the sides.
 */
export function fitRect(
  container: { width: number; height: number },
  media: { width: number; height: number },
  box: Box,
): FittedMedia {
  const scale = Math.min(
    container.width / media.width,
    container.height / media.height,
  );
  const shownWidth = media.width * scale;
  const shownHeight = media.height * scale;
  const offsetX = (container.width - shownWidth) / 2;
  const offsetY = container.height - shownHeight;
  return {
    shown: { left: offsetX, top: offsetY, width: shownWidth, height: shownHeight },
    box: {
      left: offsetX + (box.left / 100) * shownWidth,
      top: offsetY + (box.top / 100) * shownHeight,
      width: (box.width / 100) * shownWidth,
      height: (box.height / 100) * shownHeight,
    },
  };
}

/** Where the whole frame landed, and where the box inside it landed. */
export type FittedMedia = { shown: PixelRect; box: PixelRect };

function shift(rect: PixelRect, left: number, top: number): PixelRect {
  return { ...rect, left: rect.left + left, top: rect.top + top };
}

/** Tracks the fitted frame and box as the frame resizes, in the coordinates of the frame's positioned parent. */
export function useFitRect(
  ref: RefObject<HTMLElement | null>,
  media: { width: number; height: number } | null,
  box: Box | null,
): FittedMedia | null {
  const [rect, setRect] = useState<FittedMedia | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !media || !box) {
      setRect(null);
      return;
    }
        const measure = () => {
      const bounds = element.getBoundingClientRect();
            const inFrame = fitRect({ width: bounds.width, height: bounds.height }, media, box);
      setRect({
        shown: shift(inFrame.shown, element.offsetLeft, element.offsetTop),
        box: shift(inFrame.box, element.offsetLeft, element.offsetTop),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, media, box]);
  return rect;
}
