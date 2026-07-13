import {createContext, type RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {parseCssDuration} from '../../global/parse-css-duration';
import {requestAnimationFrameWithCleanup, setTimeoutWithCleanup} from '../../global/schedule-with-cleanup';

import type {Column} from '../table-props';
import type {ReorderAnimation} from '../reorder-animation';

import styles from '../table.css';

const reorderExpectationTimeout = 1000;

export interface ReorderSpec {
  direction: 'columns' | 'items';
  fromIndex: number;
  insertionIndex: number;
}

type ExpectReorder = (reorderSpec: ReorderSpec) => void;

interface ReorderAnimationContextValue {
  reorderAnimation: ReorderAnimation | null;
  expectReorder: ExpectReorder;
}

export const ReorderAnimationContext = createContext<ReorderAnimationContextValue>({
  reorderAnimation: null,
  expectReorder: () => {},
});

export function useReorderAnimationContextValue<T>({
  noColumnReorderAnimation,
  noItemReorderAnimation,
  tableRef,
  data,
  columns,
}: {
  noColumnReorderAnimation: boolean | undefined;
  noItemReorderAnimation: boolean | undefined;
  tableRef: RefObject<HTMLTableElement | null>;
  data: readonly T[];
  columns: readonly Column<T>[];
}): ReorderAnimationContextValue {
  const [reorderAnimation, setReorderAnimation] = useState<ReorderAnimation | null>(null);

  interface PendingReorder extends ReorderSpec {
    timerId: number;
    data: readonly T[];
    columns: readonly Column<T>[];
  }

  const pendingReorderRef = useRef<PendingReorder>(null);

  const expectReorder = useCallback<ExpectReorder>(
    (reorderSpec: ReorderSpec) => {
      const isColumn = reorderSpec.direction === 'columns';
      if ((isColumn && noColumnReorderAnimation) || (!isColumn && noItemReorderAnimation)) return;

      const timerId = window.setTimeout(() => {
        pendingReorderRef.current = null;
      }, reorderExpectationTimeout);
      pendingReorderRef.current = {...reorderSpec, timerId, columns, data};
    },
    [noColumnReorderAnimation, noItemReorderAnimation, columns, data],
  );

  useEffect(() => {
    return () => {
      if (pendingReorderRef.current) {
        window.clearTimeout(pendingReorderRef.current.timerId);
        pendingReorderRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const table = tableRef.current;
    const pendingReorder = pendingReorderRef.current;
    if (!table || !pendingReorder) return;

    const {direction, data: pendingData, columns: pendingColumns} = pendingReorder;
    const isColumn = direction === 'columns';
    if ((isColumn && columns === pendingColumns) || (!isColumn && data === pendingData)) return;

    pendingReorderRef.current = null;

    const {fromIndex, insertionIndex} = pendingReorder;

    const index = fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;
    return requestAnimationFrameWithCleanup(() =>
      setReorderAnimation(prev =>
        prev == null ? {direction, index, phase: 'initial', className: styles.reorderAnimationInitial} : prev,
      ),
    );
  }, [data, columns, tableRef]);

  useEffect(() => {
    if (reorderAnimation?.phase === 'initial') {
      return requestAnimationFrameWithCleanup(() =>
        setReorderAnimation(prev =>
          prev === reorderAnimation ? {...prev, phase: 'fade-out', className: styles.reorderAnimationFadeOut} : prev,
        ),
      );
    }

    if (reorderAnimation?.phase === 'fade-out') {
      const fadeOutMs = parseCssDuration(
        window.getComputedStyle(tableRef.current!).getPropertyValue('--animated-column-fade-out-duration'),
      );
      return setTimeoutWithCleanup(
        () => setReorderAnimation(prev => (prev === reorderAnimation ? null : prev)),
        fadeOutMs,
      );
    }

    return undefined;
  }, [reorderAnimation, tableRef]);

  return useMemo(() => ({reorderAnimation, expectReorder}), [reorderAnimation, expectReorder]);
}
