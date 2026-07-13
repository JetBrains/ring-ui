import {use} from 'react';

import {ReorderAnimationContext} from './internal/reorder-animation-context';

/**
 * Information about a column or item currently being animated after reorder.
 *
 * Available through {@link useReorderAnimation} to allow custom cell
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
 * Provides information about the currently animated column or item after reorder.
 *
 * Use in a custom cell renderer to animate reordered columns and items
 * consistently with the default table renderer.
 */
export function useReorderAnimation(): ReorderAnimation | null {
  return use(ReorderAnimationContext).reorderAnimation;
}
