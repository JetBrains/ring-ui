import {createContext} from 'react';

import type {TableProps} from './table-props';

/**
 * Use anywhere inside the table to get access to the props passed to it.
 * Cast to `Context<TableProps<T>>` in usage place.
 */
export const TablePropsContext = createContext<TableProps<unknown> | null>(null);

/**
 * Information about a column or item reorder animation.
 *
 * Available through {@link ReorderAnimationContext} to allow custom cell
 * renderers to animate reordered columns and items consistently with the default
 * table renderer.
 */
export interface ReorderAnimation {
  /**
   * What is animated: columns or items (rows).
   */
  direction: 'columns' | 'items';

  /**
   * Index of the column or item being animated.
   */
  index: number;

  /**
   * Current animation phase.
   */
  phase: 'initial' | 'fade-out';

  /**
   * CSS class to apply to the animated row/cell or another element used to
   * render the animation on this phase.
   *
   * The class only defines the `background-color` and `transition`
   * properties.
   */
  className: string;
}

/**
 * Provides information about the currently animated column or item reorder.
 *
 * Use in a custom cell renderer to animate reordered columns and items
 * consistently with the default table renderer.
 */
export const ReorderAnimationContext = createContext<ReorderAnimation | null>(null);

/**
 * When a row only contains unformatted single-line text, it will be exactly of this height.
 */
export const defaultRowHeight = 37;
