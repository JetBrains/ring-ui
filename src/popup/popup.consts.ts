export enum Directions {
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  TOP_CENTER = 'TOP_CENTER',
  RIGHT_TOP = 'RIGHT_TOP',
  RIGHT_BOTTOM = 'RIGHT_BOTTOM',
  RIGHT_CENTER = 'RIGHT_CENTER',
  LEFT_TOP = 'LEFT_TOP',
  LEFT_BOTTOM = 'LEFT_BOTTOM',
  LEFT_CENTER = 'LEFT_CENTER',
}

/**
 * When positioning a popup, directions will be tried in the listed order.
 * @type {Array.<string>}
 */
export const DEFAULT_DIRECTIONS = [
  Directions.BOTTOM_RIGHT,
  Directions.BOTTOM_LEFT,
  Directions.TOP_LEFT,
  Directions.TOP_RIGHT,
  Directions.RIGHT_TOP,
  Directions.RIGHT_BOTTOM,
  Directions.LEFT_TOP,
  Directions.LEFT_BOTTOM,
];

/**
 * @enum {number}
 */
export enum Dimension {
  MARGIN = 16,
  BORDER_WIDTH = 1,
}

export enum MinWidth {
  TARGET = -1,
}

export enum MaxHeight {
  SCREEN = -1,
}

export enum Display {
  HIDDEN = 0,
  SHOWING = 1,
  SHOWN = 2,
}
