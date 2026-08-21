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
  geometry: Geometry;
}

const MIN_WIDTH = 256;
const MIN_HEIGHT = 160;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const getViewportSize = () => ({
  width: document.documentElement.clientWidth || window.innerWidth,
  height: document.documentElement.clientHeight || window.innerHeight,
});

export const getNativeTabIndex = (autoFocusFirst: boolean | undefined) => (autoFocusFirst ? undefined : -1);

export const getTrapDisabled = (trapFocus: boolean, trapDisabled: boolean | undefined) => trapDisabled ?? !trapFocus;

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
  start: Geometry,
  direction: ResizeDirection,
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
    left = clamp(start.left + dx, 0, right - MIN_WIDTH);
  } else if (direction.includes('e')) {
    right = clamp(right + dx, left + MIN_WIDTH, viewportWidth);
  }
  if (direction.includes('n')) {
    top = clamp(start.top + dy, 0, bottom - MIN_HEIGHT);
  } else if (direction.includes('s')) {
    bottom = clamp(bottom + dy, top + MIN_HEIGHT, viewportHeight);
  }

  return {left, top, width: right - left, height: bottom - top};
};
