import {createContext, type RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useIntersectionObserverHandle} from '../../global/intersection-observer-context';

import styles from '../table.css';

/**
 * true = item is rendered
 * number = item is not rendered; value is its last known height, which is included in spacer
 * undefined = item has never been rendered; spacer includes the estimated height
 */
type ItemMaterialization = true | number | undefined;

export type VirtualItem = RenderedItem | Spacer;
interface RenderedItem {
  type: 'rendered';
  index: number;
}
interface Spacer {
  type: 'spacer';
  from: number;
  to: number; // exclusively
  height: number;
  key: string;
}

export const CollapseItemIntoSpacerContext = createContext<(index: number, height: number) => void>(() => {});

/**
 * RAF is somewhat too frequent. Most updates happen on virtualization boundaries
 * within the invisible overscroll area, so they don't require such a high update rate.
 * Therefore, we throttle with a custom delay.
 */
const virtualizationThrottleDelay = 50;

export function useVirtualItems<T>({
  enabled,
  data,
  data: {length},
  scrollerRef,
  tableRef,
  estimateHeight,
  lookaheadPx,
  retentionMarginPx,
  minScrollAndResizeDeltaPx,
}: {
  enabled: boolean;
  data: T[];
  scrollerRef: RefObject<HTMLElement | null> | undefined;
  tableRef: RefObject<HTMLTableElement | null>;
  estimateHeight: (item: T, index: number, items: T[]) => number;
  lookaheadPx: number;
  retentionMarginPx: number;
  minScrollAndResizeDeltaPx: number;
}) {
  const itemsMaterialization = useRef<ItemMaterialization[]>([]);

  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>(() => [
    {
      type: 'spacer',
      from: 0,
      to: length,
      height: data.reduce((acc, item, index, items) => acc + estimateHeight(item, index, items), 0),
      key: `${styles.spacerRow}-0`,
    },
  ]);

  const materializeVisibleSpacerItems = useCallback(() => {
    if (!tableRef.current) return;

    const containerHeight = scrollerRef?.current?.clientHeight ?? window.innerHeight;

    for (const spacerRow of tableRef.current.querySelectorAll(`.${styles.spacerRow}`)) {
      const rect = spacerRow.getBoundingClientRect();

      const spacerIntersectsLookaheadArea = rect.top < containerHeight + lookaheadPx && rect.bottom > -lookaheadPx;
      if (!spacerIntersectsLookaheadArea) {
        continue;
      }

      const visibleOffsetStart = Math.max(0, -rect.top);
      const visibleOffsetEnd = Math.min(rect.height, containerHeight - rect.top);

      const materializeOffsetStart = visibleOffsetStart - lookaheadPx;
      const materializeOffsetEnd = visibleOffsetEnd + lookaheadPx;

      let offsetInSpacer = 0;

      const from = Number((spacerRow as HTMLElement).dataset.from);
      const to = Number((spacerRow as HTMLElement).dataset.to);

      for (let i = from; i < to; i++) {
        const itemMaterialization = itemsMaterialization.current[i];
        const itemHeight =
          typeof itemMaterialization === 'number' ? itemMaterialization : estimateHeight(data[i], i, data);

        const itemOffsetStart = offsetInSpacer;
        const itemOffsetEnd = offsetInSpacer + itemHeight;

        if (itemOffsetStart < materializeOffsetEnd && itemOffsetEnd > materializeOffsetStart) {
          itemsMaterialization.current[i] = true;
        } else if (itemOffsetStart > materializeOffsetEnd) {
          break;
        }

        offsetInSpacer += itemHeight;
      }
    }
  }, [data, estimateHeight, lookaheadPx, scrollerRef, tableRef]);

  const recomputeVirtualItems = useCallback(() => {
    const newVirtualItems: VirtualItem[] = [];
    let spacerCounter = 0;

    for (let i = 0; i < length; i++) {
      const itemMaterialization = itemsMaterialization.current[i];

      if (itemMaterialization === true) {
        newVirtualItems.push({type: 'rendered', index: i});
      } else {
        const lastItemOrSpacer = newVirtualItems[newVirtualItems.length - 1];
        const lastSpacer = lastItemOrSpacer?.type === 'spacer' ? (lastItemOrSpacer as Spacer) : undefined;
        const height = typeof itemMaterialization === 'number' ? itemMaterialization : estimateHeight(data[i], i, data);

        if (lastSpacer) {
          lastSpacer.to = i + 1;
          lastSpacer.height += height;
        } else {
          newVirtualItems.push({
            type: 'spacer',
            from: i,
            to: i + 1,
            height,
            key: `${styles.spacerRow}-${spacerCounter++}`,
          });
        }
      }
    }

    setVirtualItems(newVirtualItems);
  }, [data, estimateHeight, length]);

  const timerIdRef = useRef<number | null>(null);
  const callbacksRef = useRef<Set<() => void> | null>(null);

  const throttle = useCallback((...callbacks: (() => void)[]) => {
    if (timerIdRef.current != null) {
      callbacks.forEach(cb => {
        callbacksRef.current!.delete(cb);
        callbacksRef.current!.add(cb);
      });
      return;
    }

    callbacksRef.current = new Set(callbacks);
    timerIdRef.current = window.setTimeout(() => {
      callbacksRef.current!.forEach(cb => cb());

      timerIdRef.current = null;
      callbacksRef.current = null;
    }, virtualizationThrottleDelay);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const scroller = scrollerRef?.current;
    let lastHandledScrollTop: number = -Infinity;
    let lastHandledHeight: number = -Infinity;
    let lastHandledWidth: number = -Infinity;

    function handleViewportChange() {
      const scrollTop = scroller ? scroller.scrollTop : window.scrollY;
      const height = scroller ? scroller.clientHeight : window.innerHeight;
      const width = scroller ? scroller.clientWidth : window.innerWidth;

      if (
        Math.abs(scrollTop - lastHandledScrollTop) >= minScrollAndResizeDeltaPx ||
        Math.abs(height - lastHandledHeight) >= minScrollAndResizeDeltaPx ||
        Math.abs(width - lastHandledWidth) >= minScrollAndResizeDeltaPx
      ) {
        lastHandledScrollTop = scrollTop;
        lastHandledHeight = height;
        lastHandledWidth = width;

        throttle(materializeVisibleSpacerItems, recomputeVirtualItems);
      }
    }

    const scrollTarget = scroller ?? window;
    scrollTarget.addEventListener('scroll', handleViewportChange, {passive: true});

    const resizeObserver = new ResizeObserver(handleViewportChange);
    const resizeTarget = scroller ?? document.documentElement;
    resizeObserver.observe(resizeTarget);

    handleViewportChange();

    return () => {
      scrollTarget.removeEventListener('scroll', handleViewportChange);
      resizeObserver.unobserve(resizeTarget);
      resizeObserver.disconnect();
      if (timerIdRef.current != null) {
        window.clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
        callbacksRef.current = null;
      }
    };
  }, [enabled, materializeVisibleSpacerItems, minScrollAndResizeDeltaPx, recomputeVirtualItems, scrollerRef, throttle]);

  const intersectionObserverHandle = useIntersectionObserverHandle(
    scrollerRef,
    scrollerRef ? retentionMarginPx : undefined,
    !scrollerRef ? retentionMarginPx : undefined,
  );

  const collapseItemIntoSpacer = useCallback(
    (index: number, height: number) => {
      if (!enabled) return;

      itemsMaterialization.current[index] = height;
      throttle(recomputeVirtualItems);
    },
    [enabled, throttle, recomputeVirtualItems],
  );

  const allVisibleVirtualItems = useMemo<VirtualItem[]>(
    () => Array.from({length: enabled ? 0 : length}, (_, index) => ({type: 'rendered', index})),
    [enabled, length],
  );

  return {
    virtualItems: enabled ? virtualItems : allVisibleVirtualItems,
    intersectionObserverHandle,
    collapseItemIntoSpacer,
  };
}

export function SpacerRow({spacer: {from, to, height}, colSpan}: {spacer: Spacer; colSpan: number}) {
  return (
    <tr className={styles.spacerRow} data-from={from} data-to={to}>
      <td className={styles.spacerCell} colSpan={colSpan} style={{height}} />
    </tr>
  );
}
