import {getColumnIndicatorVerticalSpan} from '../column-indicator-vertical-span';

import styles from '../../table.css';

export interface ColumnResizeIndicator {
  /**
   * Shows the indicator over the right edge of the column, from the header top to the table bottom.
   * `columnRight` defaults to the current right edge of `th`. Client coordinates.
   */
  position(th: Element, columnRight?: number): void;
  remove(): void;
}

/**
 * A line that marks the column boundary across the whole table, shown
 * while the resize handle is hovered or dragged.
 */
export function createColumnResizeIndicator(): ColumnResizeIndicator {
  let element: HTMLDivElement | null = null;

  return {
    position(th, columnRight = th.getBoundingClientRect().right) {
      if (!element) {
        element = document.createElement('div');
        element.className = styles.columnResizeIndicator;
        element.dataset.test = 'ring-table-column-resize-indicator';
        document.body.appendChild(element);
      }
      const span = getColumnIndicatorVerticalSpan(th);
      if (span) {
        element.style.top = `${span.top}px`;
        element.style.height = span.height;
      }
      element.style.left = `${columnRight - 1}px`;
    },

    remove() {
      element?.remove();
      element = null;
    },
  };
}
