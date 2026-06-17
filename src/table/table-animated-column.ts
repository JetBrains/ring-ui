import {createContext, type RefObject, useEffect, useState} from 'react';

import {longAnimationTimeout} from './table-const';

import type {Column} from './table';

import styles from './table.css';

const expectColumnReorderAttrName = 'data-ring-expect-column-reorder';
const expectColumnReorderInterval = 1000;

export function setExpectedColumnReorder(
  table: HTMLTableElement,
  change: [fromIndex: number, insertionIndex: number] | undefined,
) {
  if (!change) {
    table.removeAttribute(expectColumnReorderAttrName);
    return;
  }
  table.setAttribute(expectColumnReorderAttrName, JSON.stringify(change));
  window.setTimeout(() => {
    table.removeAttribute(expectColumnReorderAttrName);
  }, expectColumnReorderInterval);
}

function getExpectedColumnReorder(table: HTMLTableElement): [number, number] | null {
  const attrVal = table.getAttribute(expectColumnReorderAttrName);
  return attrVal ? JSON.parse(attrVal) : null;
}

interface AnimatedColumn {
  columnIndex: number;
  phase: 'initial' | 'fade-out';
  cellClassName: string;
}

export function useAnimatedColumn<T>({
  disabled,
  tableRef,
  columns,
}: {
  disabled: boolean | undefined;
  tableRef: RefObject<HTMLTableElement | null>;
  columns: Column<T>[];
}) {
  const [animatedColumn, setAnimatedColumn] = useState<AnimatedColumn | null>(null);

  useEffect(() => {
    if (disabled || !tableRef.current) return;

    const reorderVal = getExpectedColumnReorder(tableRef.current);
    if (!reorderVal) return;

    const [fromIndex, insertionIndex] = reorderVal;
    setExpectedColumnReorder(tableRef.current, undefined);

    const columnIndex = fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
    setAnimatedColumn({columnIndex, phase: 'initial', cellClassName: styles.animatedColumnInitial});

    let rafId: number | undefined;
    let timeoutId: number | undefined;
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        setAnimatedColumn({columnIndex, phase: 'fade-out', cellClassName: styles.animatedColumnFadeOut});
        rafId = undefined;
        timeoutId = window.setTimeout(() => {
          setAnimatedColumn(null);
          timeoutId = undefined;
        }, longAnimationTimeout);
      });
    });

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [columns, disabled, tableRef]);

  return animatedColumn;
}

export const AnimatedColumnContext = createContext<AnimatedColumn | null>(null);
