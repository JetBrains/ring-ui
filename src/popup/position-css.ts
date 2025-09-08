import {getRect} from '../global/dom';

import {calculateMinWidth} from './position';
import {Directions} from './popup.consts';

export const supportsCSSAnchorPositioning = (): boolean => {
  return CSS?.supports?.('anchor-name', 'none');
};

const getPositionArea = (direction: Directions): [style: string, name: string] => {
  switch (direction) {
    case Directions.BOTTOM_RIGHT:
      return ['block-end span-inline-end', '--bottom-right'];
    case Directions.BOTTOM_LEFT:
      return ['block-end span-inline-start', '--bottom-left'];
    case Directions.BOTTOM_CENTER:
      return ['block-end center', '--bottom-center'];

    case Directions.TOP_CENTER:
      return ['block-start center', '--top-center'];
    case Directions.TOP_RIGHT:
      return ['block-start span-inline-end', '--top-right'];
    case Directions.TOP_LEFT:
      return ['block-start span-inline-start', '--top-left'];

    case Directions.RIGHT_CENTER:
      return ['center inline-end', '--right-center'];
    case Directions.RIGHT_TOP:
      return ['span-block-start inline-end', '--right-top'];
    case Directions.RIGHT_BOTTOM:
      return ['span-block-end inline-end', '--right-bottom'];

    case Directions.LEFT_CENTER:
      return ['center inline-start', '--left-center'];
    case Directions.LEFT_TOP:
      return ['span-block-start inline-start', '--left-top'];
    case Directions.LEFT_BOTTOM:
      return ['span-block-end inline-start', '--left-bottom'];

    default:
      return ['block-end span-inline-end', '--bottom-right'];
  }
};

const getPositionFallbacks = (directions: readonly Directions[]) => {
  return directions
    .slice(1)
    .map(direction => getPositionArea(direction)[1])
    .join(', ');
};

interface SetCSSAnchorPositioningParams {
  popup: HTMLElement;
  anchor: HTMLElement;
  uid: string;
  minWidth?: number | 'target' | null;
  top?: number;
  left?: number;
  directions: readonly Directions[];
  offset?: number;
}

export const setCSSAnchorPositioning = ({
  popup,
  anchor,
  uid,
  minWidth,
  top,
  left,
  directions,
  offset,
}: SetCSSAnchorPositioningParams) => {
  const anchorName = anchor.style.getPropertyValue('anchor-name') || `--anchor-${uid}`;
  if (!anchor.style.getPropertyValue('anchor-name')) {
    anchor.style.setProperty('anchor-name', anchorName);
  }

  popup.style.setProperty('position-anchor', anchorName);

  const calculatedMinWidth = calculateMinWidth(getRect(anchor).width, minWidth);
  if (calculatedMinWidth !== null) {
    popup.style.minWidth = `${calculatedMinWidth}px`;
  }
  if (top) {
    popup.style.transform = `translateY(${top}px)`;
  }
  if (left) {
    popup.style.left = `${left}px`;
  }

  const [initialPositionStyle, initialPositionName] = getPositionArea(directions[0]);
  popup.style.setProperty('position-area', initialPositionStyle);
  if (offset) {
    popup.style.setProperty('--ring-popup-offset', `${offset}px`);
    if (initialPositionName.startsWith('--bottom') || initialPositionName.startsWith('--top')) {
      popup.style.margin = `${offset}px 0`;
    } else {
      popup.style.margin = `0 ${offset}px`;
    }
  }

  // Add fallbacks for better positioning if there are multiple directions
  const fallbacks = getPositionFallbacks(directions);
  if (fallbacks) {
    popup.style.setProperty('position-try-fallbacks', fallbacks);
  }
};
