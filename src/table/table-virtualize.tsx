import {type RefObject, useEffect, useMemo, useRef, useState} from 'react';

import useEventCallback from '../global/use-event-callback';
import scheduleRAF from '../global/schedule-raf';

import styles from './table.css';

/**
 * true = visible
 * number = the height of the item when it is not visible
 * undefined = wasn't ever visible
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

// TODO scroller ref
export function useTableVirtualize(
  dataLength: number,
  tableRef: RefObject<HTMLTableElement | null>,
  estimateHeight: (index: number) => number,
) {
  const itemsMaterialization = useRef<ItemMaterialization[]>([]);

  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([
    {
      type: 'spacer',
      from: 0,
      to: dataLength,
      height: Array.from({length: dataLength}, (_, i) => estimateHeight(i)).reduce((a, b) => a + b),
      key: `${styles.spacerRow}-0`,
    },
  ]);

  const recomputeVirtualItems = useEventCallback(() => {
    const newVirtualItems: VirtualItem[] = [];
    let spacerCounter = 0;

    for (let i = 0; i < dataLength; i++) {
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

  const scrollListenerRaf = useMemo(() => scheduleRAF(), []);

  useEffect(() => {
    function scrollListener() {
      scrollListenerRaf(() => {
        if (!tableRef.current) return;

        for (const spacerRow of tableRef.current.querySelectorAll(`.${styles.spacerRow}`)) {
          const rect = spacerRow.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const spacerVisibleOffsetStart = Math.max(0, -rect.top);
            const spacerInvisibleBottom = Math.max(0, rect.bottom - window.innerHeight);
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

              if (itemVisibleFrom < spacerVisibleOffsetEnd && itemVisibleTo > spacerVisibleOffsetStart) {
                itemsMaterialization.current[i] = true;
              } else if (itemVisibleFrom > spacerVisibleOffsetEnd) {
                break;
              }

              accumulatedHeight += itemHeight;
            }
          }
        }

        recomputeVirtualItems();
      });
    }

    window.addEventListener('scroll', scrollListener, {passive: true});
    // TODO resize
    scrollListener();
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [recomputeVirtualItems, scrollListenerRaf, estimateHeight, tableRef, dataLength]);

  const virtualizeItemRaf = useMemo(() => scheduleRAF(), []);

  const virtualizeItem = useEventCallback<[index: number, height: number], void>((index, height) => {
    itemsMaterialization.current[index] = height;
    virtualizeItemRaf(() => {
      recomputeVirtualItems();
    });
  });

  return {virtualItems, virtualizeItem};
}

export function SpacerRow({spacer, colSpan}: {spacer: Spacer; colSpan: number}) {
  return (
    <tr className={styles.spacerRow} data-from={spacer.from} data-to={spacer.to}>
      <td className={styles.spacerCell} colSpan={colSpan} style={{height: `${spacer.height}px`}} />
    </tr>
  );
}
