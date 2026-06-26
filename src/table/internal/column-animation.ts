import {type RefObject, useCallback, useEffect, useRef, useState} from 'react';

import {parseCssDuration} from '../../global/parse-css-duration';

import type {Column} from '../table-props';
import type {ColumnAnimation} from '../table-const';

import styles from '../table.css';

const reorderExpectationTimeout = 1000;

export interface ReorderSpec {
  fromIndex: number;
  insertionIndex: number;
}

export type ExpectColumnReorder = (reorderSpec: ReorderSpec) => void;

export function useColumnAnimation<T>({
  disabled,
  tableRef,
  columns,
}: {
  disabled: boolean | undefined;
  tableRef: RefObject<HTMLTableElement | null>;
  columns: Column<T>[];
}) {
  const [columnAnimation, setColumnAnimation] = useState<ColumnAnimation | null>(null);

  const pendingColumnReorder = useRef<ReorderSpec & {timerId: number; columns: Column<T>[]}>(null);

  const expectColumnReorder = useCallback<ExpectColumnReorder>(
    (reorderSpec: ReorderSpec) => {
      if (disabled) return;

      const timerId = window.setTimeout(() => {
        pendingColumnReorder.current = null;
      }, reorderExpectationTimeout);
      pendingColumnReorder.current = {...reorderSpec, timerId, columns};
    },
    [disabled, columns],
  );

  useEffect(() => {
    return () => {
      if (pendingColumnReorder.current) {
        window.clearTimeout(pendingColumnReorder.current.timerId);
        pendingColumnReorder.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const table = tableRef.current;
    if (!table || !pendingColumnReorder.current || columns === pendingColumnReorder.current.columns) return;

    const {fromIndex, insertionIndex} = pendingColumnReorder.current;
    pendingColumnReorder.current = null;

    const columnIndex = fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
    let rafId: number | null = requestAnimationFrame(() => {
      setColumnAnimation(prev =>
        prev == null ? {columnIndex, phase: 'initial', cellClassName: styles.animatedColumnInitial} : prev,
      );
      rafId = null;
    });
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [columns, tableRef]);

  useEffect(() => {
    if (columnAnimation?.phase === 'initial') {
      let rafId: number | null = requestAnimationFrame(() => {
        setColumnAnimation(prev =>
          prev === columnAnimation ? {...prev, phase: 'fade-out', cellClassName: styles.animatedColumnFadeOut} : prev,
        );
        rafId = null;
      });
      return () => {
        if (rafId != null) cancelAnimationFrame(rafId);
      };
    }

    if (columnAnimation?.phase === 'fade-out') {
      const fadeOutMs = parseCssDuration(
        window.getComputedStyle(tableRef.current!).getPropertyValue('--animated-column-fade-out-duration'),
      );
      let timeoutId: number | null = window.setTimeout(() => {
        setColumnAnimation(prev => (prev === columnAnimation ? null : prev));
        timeoutId = null;
      }, fadeOutMs);
      return () => {
        if (timeoutId != null) window.clearTimeout(timeoutId);
      };
    }

    return undefined;
  }, [columnAnimation, tableRef]);
  return {columnAnimation, expectColumnReorder};
}
