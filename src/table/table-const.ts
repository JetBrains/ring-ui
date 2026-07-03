import {createContext} from 'react';

import type {TableProps} from './table-props';

/**
 * Use anywhere inside the table to get access to the props passed to it.
 * Cast to `Context<TableProps<T>>` in usage place.
 */
export const TablePropsContext = createContext<TableProps<unknown> | null>(null);

/**
 * Information about a column reorder animation.
 *
 * Available through {@link ColumnAnimationContext} to allow custom cell
 * renderers to animate reordered columns consistently with the default
 * table renderer.
 */
export interface ColumnAnimation {
  /**
   * Index of the column being animated.
   */
  columnIndex: number;

  /**
   * Current animation phase.
   */
  phase: 'initial' | 'fade-out';

  /**
   * CSS class to apply to the animated cell or another element used to
   * render the animation.
   *
   * The class only defines the `background-color` and `transition`
   * properties.
   */
  cellClassName: string;
}

/**
 * Provides information about the currently animated column.
 *
 * Use in a custom cell renderer to animate reordered columns
 * consistently with the default table renderer.
 */
export const ColumnAnimationContext = createContext<ColumnAnimation | null>(null);

/**
 * When a row only contains unformatted single-line text, it will be exactly of this height.
 */
export const defaultRowHeight = 37;
