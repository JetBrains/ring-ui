import {getDocumentScrollLeft, getDocumentScrollTop, getRect, getWindowHeight, isMounted, Rect} from '../global/dom';

import {Dimension, Directions, MaxHeight, MinWidth} from './popup.consts';

export {Dimension, Directions, MaxHeight, MinWidth};

function getScrollingCoordinates(container: Element | null) {
  if (container !== null) {
    return {
      top: container.scrollTop,
      left: container.scrollLeft,
    };
  }

  return {
    top: getDocumentScrollTop(),
    left: getDocumentScrollLeft(),
  };
}

function getPositionStyles(
  popup: HTMLElement,
  anchorRect: Rect,
  anchorLeft: number,
  anchorTop: number,
  offset: number,
) {
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  const anchorBottom = anchorTop + anchorRect.height;
  const anchorRight = anchorLeft + anchorRect.width;

  const popupLeft = anchorLeft - popupWidth;
  const popupTop = anchorTop - popupHeight;
  const popupRightToLeft = anchorRight - popupWidth;
  const popupHorizontalCenter = anchorLeft + anchorRect.width / 2 - popupWidth / 2;
  const popupVerticalCenter = anchorTop + anchorRect.height / 2 - popupHeight / 2;
  const popupBottomToTop = anchorBottom - popupHeight;

  return {
    [Directions.BOTTOM_RIGHT]: {left: anchorLeft, top: anchorBottom + offset},
    [Directions.BOTTOM_LEFT]: {left: popupRightToLeft, top: anchorBottom + offset},
    [Directions.BOTTOM_CENTER]: {left: popupHorizontalCenter, top: anchorBottom + offset},
    [Directions.TOP_RIGHT]: {left: anchorLeft, top: popupTop - offset},
    [Directions.TOP_LEFT]: {left: popupRightToLeft, top: popupTop - offset},
    [Directions.TOP_CENTER]: {left: popupHorizontalCenter, top: popupTop - offset},
    [Directions.LEFT_BOTTOM]: {left: popupLeft - offset, top: anchorTop},
    [Directions.LEFT_TOP]: {left: popupLeft - offset, top: popupBottomToTop},
    [Directions.LEFT_CENTER]: {left: popupLeft - offset, top: popupVerticalCenter},
    [Directions.RIGHT_BOTTOM]: {left: anchorRight + offset, top: anchorTop},
    [Directions.RIGHT_TOP]: {left: anchorRight + offset, top: popupBottomToTop},
    [Directions.RIGHT_CENTER]: {left: anchorRight + offset, top: popupVerticalCenter},
  };
}

interface Position {
  top: number;
  left: number;
}

export interface PositionStyles extends Position {
  maxHeight?: number;
  minWidth?: number;
}

export interface PositionAttrs {
  popup: HTMLElement | null | undefined;
  anchor: Element | null | undefined;
  container: Element | null;
  directions: readonly Directions[];
  autoPositioning: boolean;
  sidePadding: number;
  top: number;
  left: number;
  offset: number;
  maxHeight: number | 'screen' | null | undefined;
  minWidth: number | 'target' | null | undefined;
  autoCorrectTopOverflow: boolean;
}

interface OverflowAttrs extends PositionAttrs {
  popup: HTMLElement;
}

function verticalOverflow(styles: PositionStyles, scrollingCoordinates: Position, attrs: OverflowAttrs) {
  const containerHeight = attrs.container !== null ? attrs.container.clientHeight : getWindowHeight();
  const viewportMinX = scrollingCoordinates.top + attrs.sidePadding;
  const viewportMaxX = scrollingCoordinates.top + containerHeight - attrs.sidePadding;

  const topOverflow = Math.max(viewportMinX - styles.top, 0);

  const popupHeight = attrs.popup.clientHeight;
  const verticalDiff = styles.top + popupHeight - viewportMaxX;
  const bottomOverflow = Math.max(verticalDiff, 0);

  return topOverflow + bottomOverflow;
}

function horizontalOverflow(styles: PositionStyles, scrollingCoordinates: Position, attrs: OverflowAttrs) {
  const containerWidth = attrs.container !== null ? attrs.container.clientWidth : window.innerWidth;
  const viewportMinY = scrollingCoordinates.left + attrs.sidePadding;
  const viewportMaxY = scrollingCoordinates.left + containerWidth - attrs.sidePadding;

  const leftOverflow = Math.max(viewportMinY - styles.left, 0);

  const popupWidth = attrs.popup.clientWidth;
  const horizontalDiff = styles.left + popupWidth - viewportMaxY;
  const rightOverflow = Math.max(horizontalDiff, 0);

  return leftOverflow + rightOverflow;
}

export const positionPropKeys = [
  'directions',
  'autoPositioning',
  'autoCorrectTopOverflow',
  'sidePadding',
  'top',
  'left',
  'offset',
  'maxHeight',
  'minWidth',
] as const;

const defaultcontainerRect = {
  top: 0,
  left: 0,
};

interface TopOffScreenParams {
  sidePadding: number;
  styles: PositionStyles;
  anchorRect: Rect;
  maxHeight: number | 'screen' | null | undefined;
  popupScrollHeight: number;
  direction: Directions | null;
  scroll: Position;
}

function handleTopOffScreen({
  sidePadding,
  styles,
  anchorRect,
  maxHeight,
  popupScrollHeight,
  direction,
  scroll,
}: TopOffScreenParams) {
  const BORDER_COMPENSATION = 1;
  const {TOP_LEFT, TOP_RIGHT, TOP_CENTER, RIGHT_TOP, LEFT_TOP} = Directions;

  const openedToTop = direction != null && [TOP_LEFT, TOP_RIGHT, TOP_CENTER, RIGHT_TOP, LEFT_TOP].includes(direction);

  if (!openedToTop) {
    return styles;
  }

  const isAttachedToAnchorTop = direction != null && [TOP_LEFT, TOP_CENTER, TOP_RIGHT].includes(direction);
  const attachingPointY = isAttachedToAnchorTop ? anchorRect.top : anchorRect.bottom;

  const effectiveHeight =
    maxHeight && typeof maxHeight === 'number' ? Math.min(popupScrollHeight, maxHeight) : popupScrollHeight;
  const hypotheticalTop = attachingPointY - effectiveHeight;

  if (hypotheticalTop <= sidePadding) {
    styles.top = sidePadding + scroll.top;
    styles.maxHeight = attachingPointY - sidePadding + BORDER_COMPENSATION;
  }

  return styles;
}

export function maxHeightForDirection(direction: Directions, anchorNode: Element, containerNode?: Element | null) {
  const container = containerNode || document.documentElement;
  const domRect = anchorNode.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const containerTop = domRect.top < 0 ? containerRect.top : Math.max(containerRect.top, 0);
  const topMaxHeight = Math.max(domRect.top - containerTop, 0);
  const containerHeight = Math.max(
    containerRect.height,
    // XXX
    // If container is the document element
    // then we check client height too because we may have situation when
    // "height" from "getBoundingClientRect" less then "clientHeight".
    container === document.documentElement ? container.clientHeight : 0,
  );
  const bottomMaxHeight = Math.max(containerHeight - (topMaxHeight + domRect.height), 0);
  switch (direction) {
    case Directions.TOP_LEFT:
    case Directions.TOP_CENTER:
    case Directions.TOP_RIGHT:
      return topMaxHeight;
    case Directions.BOTTOM_LEFT:
    case Directions.BOTTOM_CENTER:
    case Directions.BOTTOM_RIGHT:
      return bottomMaxHeight;
    case Directions.LEFT_BOTTOM:
    case Directions.RIGHT_BOTTOM:
      return domRect.height + bottomMaxHeight;
    case Directions.LEFT_TOP:
    case Directions.RIGHT_TOP:
      return domRect.height + topMaxHeight;
    case Directions.RIGHT_CENTER:
    case Directions.LEFT_CENTER:
      return domRect.height / 2 + Math.min(bottomMaxHeight / 2, topMaxHeight / 2);
    default:
      return null;
  }
}

export default function position(attrs: PositionAttrs) {
  const {
    popup,
    anchor,
    container,
    directions,
    autoPositioning,
    sidePadding,
    top,
    left,
    offset,
    maxHeight,
    minWidth,
    autoCorrectTopOverflow = true,
  } = attrs;

  let styles: PositionStyles = {
    top: 0,
    left: 0,
  };
  let chosenDirection = null;

  const containerRect = container !== null ? getRect(container) : defaultcontainerRect;
  const defaultAnchor = container !== null ? container : document.body;
  const anchorRect = getRect(isMounted(anchor) ? anchor : defaultAnchor);
  const scroll = getScrollingCoordinates(container);
  const anchorLeft = anchorRect.left + scroll.left + left - containerRect.left;
  const anchorTop = anchorRect.top + scroll.top + top - containerRect.top;

  if (popup) {
    const overflowAttrs = {...attrs, popup};
    const directionsMatrix = getPositionStyles(popup, anchorRect, anchorLeft, anchorTop, offset);
    if (!autoPositioning || directions.length === 1) {
      styles = directionsMatrix[directions[0]];
      chosenDirection = directions[0];
    } else {
      const sortedByIncreasingOverflow = directions
        // Fall back to the first option
        .concat(directions[0])
        .filter(direction => directionsMatrix[direction])
        .map(direction => ({styles: directionsMatrix[direction], direction}))
        .sort(({styles: stylesA}, {styles: stylesB}) => {
          const overflowA =
            verticalOverflow(stylesA, scroll, overflowAttrs) + horizontalOverflow(stylesA, scroll, overflowAttrs);
          const overflowB =
            verticalOverflow(stylesB, scroll, overflowAttrs) + horizontalOverflow(stylesB, scroll, overflowAttrs);
          return overflowA - overflowB;
        });
      styles = sortedByIncreasingOverflow[0].styles;
      chosenDirection = sortedByIncreasingOverflow[0].direction;
    }

    // because of the anchor negative margin top and left also may become negative
    (['left', 'top'] as const).forEach(key => {
      if (styles[key] < 0) {
        styles[key] = 0;
      }
    });
  }

  if (maxHeight === MaxHeight.SCREEN || maxHeight === 'screen') {
    // this feature works properly only when direction is BOTTOM_* or *_BOTTOM
    styles.maxHeight = window.innerHeight + scroll.top - styles.top - Dimension.MARGIN;
  } else if (maxHeight) {
    styles.maxHeight = maxHeight;
  }

  if (autoCorrectTopOverflow) {
    styles = handleTopOffScreen({
      sidePadding,
      styles,
      anchorRect,
      maxHeight,
      direction: chosenDirection,
      popupScrollHeight: popup?.scrollHeight ?? 0,
      scroll,
    });
  }

  if (minWidth === MinWidth.TARGET || minWidth === 'target') {
    styles.minWidth = anchorRect.width;
  } else if (minWidth) {
    styles.minWidth = anchorRect.width < minWidth ? minWidth : anchorRect.width;
  }

  return {styles, direction: chosenDirection};
}
