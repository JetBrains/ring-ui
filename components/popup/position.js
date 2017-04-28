import 'dom4';
import {
  getDocumentScrollLeft,
  getDocumentScrollTop,
  getRect,
  getWindowHeight,
  isMounted
} from '../global/dom';

export const Directions = {
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_CENTER: 'BOTTOM_CENTER',
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  TOP_CENTER: 'TOP_CENTER',
  RIGHT_TOP: 'RIGHT_TOP',
  RIGHT_BOTTOM: 'RIGHT_BOTTOM',
  RIGHT_CENTER: 'RIGHT_CENTER',
  LEFT_TOP: 'LEFT_TOP',
  LEFT_BOTTOM: 'LEFT_BOTTOM',
  LEFT_CENTER: 'LEFT_CENTER'
};

/**
 * When positioning a popup, directions will be tried in the listed order.
 * @type {Array.<string>}
 */
export const DEFAULT_DIRECTIONS = [
  Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.TOP_LEFT, Directions.TOP_RIGHT,
  Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.LEFT_TOP, Directions.LEFT_BOTTOM
];

/**
 * @enum {number}
 */
export const Dimension = {
  MARGIN: 16,
  BORDER_WIDTH: 1
};

export const MinWidth = {
  TARGET: -1
};

export const MaxHeight = {
  SCREEN: -1
};

export const Display = {
  HIDDEN: 0,
  SHOWING: 1,
  SHOWN: 2
};

function getScrollingCoordinates() {
  return {
    top: getDocumentScrollTop(),
    left: getDocumentScrollLeft()
  };
}

function getPositionStyles(popup, anchorRect, anchorLeft, anchorTop) {
  const popupWidth = popup.clientWidth;
  const popupHeight = popup.clientHeight;

  const anchorBottom = anchorTop + anchorRect.height;
  const anchorRight = anchorLeft + anchorRect.width;

  const popupLeft = anchorLeft - popupWidth;
  const popupTop = anchorTop - popupHeight;
  const popupRightToLeft = anchorRight - popupWidth;
  const popupHorizontalCenter = anchorLeft + anchorRect.width / 2 - popupWidth / 2;
  const popupVerticalCenter = anchorTop + anchorRect.height / 2 - popupHeight / 2;
  const popupBottomToTop = anchorBottom - popupHeight;

  return {
    [Directions.BOTTOM_RIGHT]: {left: anchorLeft, top: anchorBottom},
    [Directions.BOTTOM_LEFT]: {left: popupRightToLeft, top: anchorBottom},
    [Directions.BOTTOM_CENTER]: {left: popupHorizontalCenter, top: anchorBottom},
    [Directions.TOP_RIGHT]: {left: anchorLeft, top: popupTop},
    [Directions.TOP_LEFT]: {left: popupRightToLeft, top: popupTop},
    [Directions.TOP_CENTER]: {left: popupHorizontalCenter, top: popupTop},
    [Directions.LEFT_BOTTOM]: {left: popupLeft, top: anchorTop},
    [Directions.LEFT_TOP]: {left: popupLeft, top: popupBottomToTop},
    [Directions.LEFT_CENTER]: {left: popupLeft, top: popupVerticalCenter},
    [Directions.RIGHT_BOTTOM]: {left: anchorRight, top: anchorTop},
    [Directions.RIGHT_TOP]: {left: anchorRight, top: popupBottomToTop},
    [Directions.RIGHT_CENTER]: {left: anchorRight, top: popupVerticalCenter}
  };
}

function verticalOverflow(styles, scrollingCoordinates, attrs) {
  const viewportMinX = scrollingCoordinates.top + attrs.sidePadding;
  const viewportMaxX = scrollingCoordinates.top + getWindowHeight() - attrs.sidePadding;

  const topOverflow = Math.max(viewportMinX - styles.top, 0);

  const popupHeight = attrs.popup.clientHeight;
  const verticalDiff = styles.top + popupHeight - viewportMaxX;
  const bottomOverflow = Math.max(verticalDiff, 0);

  return topOverflow + bottomOverflow;
}

function horizontalOverflow(styles, scrollingCoordinates, attrs) {
  const viewportMinY = scrollingCoordinates.left + attrs.sidePadding;
  const viewportMaxY = scrollingCoordinates.left + window.innerWidth - attrs.sidePadding;

  const leftOverflow = Math.max(viewportMinY - styles.left, 0);

  const popupWidth = attrs.popup.clientWidth;
  const horizontalDiff = styles.left + popupWidth - viewportMaxY;
  const rightOverflow = Math.max(horizontalDiff, 0);

  return leftOverflow + rightOverflow;
}

export const positionPropKeys = [
  'directions',
  'autoPositioning',
  'sidePadding',
  'top',
  'left',
  'maxHeight',
  'minWidth'
];

export default function position(attrs) {
  const {
    popup,
    anchor,
    directions,
    autoPositioning,
    sidePadding, // eslint-disable-line no-unused-vars
    top,
    left,
    maxHeight,
    minWidth
  } = attrs;

  let styles = {
    top: 0,
    left: 0
  };

  const anchorRect = getRect(isMounted(anchor) ? anchor : document.body);
  const scroll = getScrollingCoordinates();
  const anchorLeft = anchorRect.left + scroll.left + left;
  const anchorTop = anchorRect.top + scroll.top + top;

  if (popup) {
    const directionsMatrix = getPositionStyles(popup, anchorRect, anchorLeft, anchorTop);
    if (!autoPositioning || directions.length === 1) {
      styles = directionsMatrix[directions[0]];
    } else {
      const directionStylesSortedByIncreasingOverflow = directions.
      // Fall back to the first option
      concat(directions[0]).filter(direction => directionsMatrix[direction]).
      map(direction => directionsMatrix[direction]).
      sort((firstDirectionStyles, secondDirectionStyles) => {
        const firstDirectionOverflow =
          verticalOverflow(firstDirectionStyles, scroll, attrs) +
          horizontalOverflow(firstDirectionStyles, scroll, attrs);
        const secondDirectionOverflow =
          verticalOverflow(secondDirectionStyles, scroll, attrs) +
          horizontalOverflow(secondDirectionStyles, scroll, attrs);
        return firstDirectionOverflow - secondDirectionOverflow;
      });

      styles = directionStylesSortedByIncreasingOverflow[0];
    }
  }

  if (maxHeight === MaxHeight.SCREEN || maxHeight === 'screen') {
    // this feature works properly only when direction is BOTTOM_* or *_BOTTOM
    styles.maxHeight = window.innerHeight + scroll.top - styles.top - Dimension.MARGIN;
  } else if (maxHeight) {
    styles.maxHeight = maxHeight;
  }

  if (minWidth === MinWidth.TARGET || minWidth === 'target') {
    styles.minWidth = anchorRect.width;
  } else if (minWidth) {
    styles.minWidth = minWidth;
  }

  return styles;
}
