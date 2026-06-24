import {createContext} from 'react';

import type {TableProps} from './table-props';

/**
 * Use anywhere inside the table to get access to the props passed to it.
 * Cast to `Context<TableProps<T>>` in usage place.
 */
export const TablePropsContext = createContext<TableProps<unknown> | null>(null);

/**
 * Use in a custom row renderer to make the row eligible for virtualization.
 * Use together with `useIsIntersectingListener()` to detect when the row is no longer visible.
 * When the row is no longer visible, call the function from this context with the height of the row.
 */
export const CollapseItemIntoSpacerContext = createContext<(height: number) => void>(() => {});

export interface AnimatedColumn {
  columnIndex: number;
  phase: 'initial' | 'fade-out';
  cellClassName: string;
}

/**
 * Use in a custom cell renderer if you want to animate your custom cell when its column is reordered.
 */
export const AnimatedColumnContext = createContext<AnimatedColumn | null>(null);

/**
 * When a row only contains unformatted single-line text, it will be exactly of this height.
 */
export const defaultRowHeight = 37;
