import {createContext} from 'react';

import type {TableProps} from './table-props';

/**
 * Use anywhere inside the table to get access to the props passed to it.
 * Cast to `Context<TableProps<T>>` in usage place.
 */
export const TablePropsContext = createContext<TableProps<unknown> | null>(null);

/**
 * When a row only contains unformatted single-line text, it will be exactly of this height.
 */
export const defaultRowHeight = 37;
