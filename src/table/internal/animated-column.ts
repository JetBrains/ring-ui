import {type RefObject, useEffect} from 'react';

import {parseCssDuration} from '../../global/parse-css-duration';

import type {Column} from '../table-props';
import type {AnimatedColumn} from '../table-const';

import styles from '../table.css';

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

export function useAnimatedColumn<T>({
  animatedColumn,
  setAnimatedColumn,
  disabled,
  tableRef,
  columns,
}: {
  animatedColumn: AnimatedColumn | null;
  setAnimatedColumn: (animatedColumn: AnimatedColumn | null) => void;
  disabled: boolean | undefined;
  tableRef: RefObject<HTMLTableElement | null>;
  columns: Column<T>[];
}) {
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

        const fadeOutMs = parseCssDuration(
          window.getComputedStyle(tableRef.current!).getPropertyValue('--animated-column-fade-out-duration'),
        );
        timeoutId = window.setTimeout(() => {
          setAnimatedColumn(null);
          timeoutId = undefined;
        }, fadeOutMs);
      });
    });

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [columns, disabled, setAnimatedColumn, tableRef]);

  return animatedColumn;
}
