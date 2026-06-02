import {type RefObject, useEffect, useRef, useState} from 'react';

import useEventCallback from '../global/use-event-callback';

import styles from './table.css';

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

/**
 * Measurement inaccuracies and rounding artifacts may slightly change the
 * table height during virtualization, causing scroll anchoring to trigger
 * scroll events. Small scroll deltas are therefore ignored to avoid oscillations
 * at virtualization boundaries.
 */
const minMeaningfulScrollDelta = 50;

/**
 * RAF is somewhat too frequent. Most updates happen on virtualization boundaries
 * within the invisible overscroll area, so they don't require such a high update rate.
 * Therefore, we throttle with a custom delay.
 */
const virtualizationThrottleDelay = 50;

export function useTableVirtualize({
  enabled,
  length,
  scrollerRef,
  tableRef,
  estimateHeight,
  overscrollPx,
}: {
  enabled: boolean;
  length: number; // TODO react on change
  scrollerRef: RefObject<HTMLElement | null> | undefined;
  tableRef: RefObject<HTMLTableElement | null>;
  estimateHeight: (index: number) => number;
  overscrollPx: number;
}) {
  const itemsMaterialization = useRef<ItemMaterialization[]>([]);

  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>(() =>
    enabled
      ? [
          {
            type: 'spacer',
            from: 0,
            to: length,
            height: Array.from({length}, (_, i) => estimateHeight(i)).reduce((a, b) => a + b, 0),
            key: `${styles.spacerRow}-0`,
          },
        ]
      : Array.from({length}, (_, index) => ({type: 'rendered', index})),
  );

  const materializeVisibleSpacerItems = useEventCallback(() => {
    if (!tableRef.current) return;

    for (const spacerRow of tableRef.current.querySelectorAll(`.${styles.spacerRow}`)) {
      const rect = spacerRow.getBoundingClientRect();
      const containerHeight = scrollerRef?.current?.clientHeight ?? window.innerHeight;
      if (rect.top - overscrollPx < containerHeight && rect.bottom + overscrollPx > 0) {
        const spacerVisibleOffsetStart = Math.max(0, -rect.top);
        const spacerInvisibleBottom = Math.max(0, rect.bottom - containerHeight);
        const spacerVisibleOffsetEnd = rect.height - spacerInvisibleBottom;

        let accumulatedHeight = 0;
        for (
          let i = Number((spacerRow as HTMLElement).dataset.from);
          i < Number((spacerRow as HTMLElement).dataset.to);
          i++
        ) {
          const itemMaterialization = itemsMaterialization.current[i];
          const itemHeight = typeof itemMaterialization === 'number' ? itemMaterialization : estimateHeight(i);
          const itemVisibleFrom = accumulatedHeight;
          const itemVisibleTo = accumulatedHeight + itemHeight;

          if (
            itemVisibleFrom < spacerVisibleOffsetEnd + overscrollPx &&
            itemVisibleTo > spacerVisibleOffsetStart - overscrollPx
          ) {
            itemsMaterialization.current[i] = true;
          } else if (itemVisibleFrom > spacerVisibleOffsetEnd + overscrollPx) {
            break;
          }

          accumulatedHeight += itemHeight;
        }
      }
    }
  });

  const recomputeVirtualItems = useEventCallback(() => {
    const newVirtualItems: VirtualItem[] = [];
    let spacerCounter = 0;

    for (let i = 0; i < length; i++) {
      const itemMaterialization = itemsMaterialization.current[i];

      if (itemMaterialization === true) {
        newVirtualItems.push({type: 'rendered', index: i});
      } else {
        const lastItemOrSpacer = newVirtualItems[newVirtualItems.length - 1];
        const lastSpacer = lastItemOrSpacer?.type === 'spacer' ? (lastItemOrSpacer as Spacer) : undefined;
        const height = typeof itemMaterialization === 'number' ? itemMaterialization : estimateHeight(i);

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
  });

  const timerIdRef = useRef<number | null>(null);
  const callbacksRef = useRef<Set<() => void> | null>(null);

  const throttle = useEventCallback((...callbacks: (() => void)[]) => {
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
  });

  useEffect(() => {
    if (!enabled) return;

    const scrollContainer = scrollerRef?.current ?? window;
    let lastHandledScrollTop: number | null = null;

    function scrollListener() {
      const scrollTop = scrollContainer instanceof Window ? scrollContainer.scrollY : scrollContainer.scrollTop;
      if (lastHandledScrollTop != null && Math.abs(scrollTop - lastHandledScrollTop) < minMeaningfulScrollDelta) {
        // TODO ResizeObserver should also track its minMeaningfulResizeDelta
        return;
      }

      lastHandledScrollTop = scrollTop;

      throttle(materializeVisibleSpacerItems, recomputeVirtualItems);
    }

    scrollContainer.addEventListener('scroll', scrollListener, {passive: true});

    const resizeTarget = scrollerRef?.current ?? document.body;
    const resizeObserver = new ResizeObserver(scrollListener);
    resizeObserver.observe(resizeTarget);

    scrollListener();

    return () => {
      scrollContainer.removeEventListener('scroll', scrollListener);
      resizeObserver.unobserve(resizeTarget);
      resizeObserver.disconnect();
    };
  }, [enabled, materializeVisibleSpacerItems, recomputeVirtualItems, scrollerRef, throttle]);

  const collapseItemIntoSpacer = useEventCallback<[index: number, height: number], void>((index, height) => {
    if (!enabled) return;

    itemsMaterialization.current[index] = height;
    throttle(recomputeVirtualItems);
  });

  return {virtualItems, collapseItemIntoSpacer};
}

export function SpacerRow({spacer: {from, to, height}, colSpan}: {spacer: Spacer; colSpan: number}) {
  return (
    <tr className={styles.spacerRow} data-from={from} data-to={to}>
      <td className={styles.spacerCell} colSpan={colSpan} style={{height}} />
    </tr>
  );
}
