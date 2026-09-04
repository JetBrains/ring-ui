export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
export type InteractionDirection = 'move' | ResizeDirection;

export interface Geometry {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface DialogState {
  shortcutsScope: string;
  geometry: Geometry | null;
  resized: boolean;
}

export interface Interaction {
  pointerId: number;
  direction: InteractionDirection;
  startX: number;
  startY: number;
  minWidth: number;
  minHeight: number;
  geometry: Geometry;
}

const MIN_WIDTH = 256;
const MIN_HEIGHT = 160;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const getNativeTabIndex = (autoFocusFirst: boolean | undefined) => (autoFocusFirst ? undefined : -1);

export const getTrapDisabled = (trapFocus: boolean, trapDisabled: boolean | undefined) => trapDisabled ?? !trapFocus;

export const getResizeMinimum = (element: Element) => {
  const {minWidth, minHeight} = getComputedStyle(element);
  const parsedWidth = parseFloat(minWidth);
  const parsedHeight = parseFloat(minHeight);
  return {
    minWidth: Number.isNaN(parsedWidth) ? MIN_WIDTH : parsedWidth,
    minHeight: Number.isNaN(parsedHeight) ? MIN_HEIGHT : parsedHeight,
  };
};

export const moveGeometry = (
  start: Geometry,
  dx: number,
  dy: number,
  viewportWidth: number,
  viewportHeight: number,
): Geometry => ({
  ...start,
  left: clamp(start.left + dx, 0, Math.max(0, viewportWidth - start.width)),
  top: clamp(start.top + dy, 0, Math.max(0, viewportHeight - start.height)),
});

export const fitGeometry = (geometry: Geometry, viewportWidth: number, viewportHeight: number): Geometry => {
  const width = Math.min(geometry.width, viewportWidth);
  const height = Math.min(geometry.height, viewportHeight);

  return {
    left: clamp(geometry.left, 0, Math.max(0, viewportWidth - width)),
    top: clamp(geometry.top, 0, Math.max(0, viewportHeight - height)),
    width,
    height,
  };
};

export const resizeGeometry = (
  {geometry: start, direction, minWidth, minHeight}: Interaction,
  dx: number,
  dy: number,
  viewportWidth: number,
  viewportHeight: number,
): Geometry => {
  let left = start.left;
  let right = start.left + start.width;
  let top = start.top;
  let bottom = start.top + start.height;

  if (direction.includes('w')) {
    left = clamp(start.left + dx, 0, right - Math.min(minWidth, right));
  } else if (direction.includes('e')) {
    right = clamp(right + dx, left + Math.min(minWidth, viewportWidth - left), viewportWidth);
  }
  if (direction.includes('n')) {
    top = clamp(start.top + dy, 0, bottom - Math.min(minHeight, bottom));
  } else if (direction.includes('s')) {
    bottom = clamp(bottom + dy, top + Math.min(minHeight, viewportHeight - top), viewportHeight);
  }

  return {left, top, width: right - left, height: bottom - top};
};
