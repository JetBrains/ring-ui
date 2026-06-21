import {createContext} from 'react';

import type {TableProps} from './table';

export const TablePropsContext = createContext<TableProps<unknown> | null>(null);
export const CollapseItemIntoSpacerContext = createContext<(height: number) => void>(() => {});

export const defaultRowHeight = 37;
export const defaultLookaheadPx = 400;
export const defaultRetentionMarginPx = 450;
export const defaultMinScrollAndResizeDeltaPx = 50;

export const stdAnimationTimeout = 300;
export const longAnimationTimeout = 600;
