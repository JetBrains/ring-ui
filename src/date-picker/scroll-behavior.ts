import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {type CalendarProps, type ScrollDate} from './consts';
import {type ScrollArith} from './scroll-arith';

const RESUME_SCROLL_HANDLING_DELAY_MS = 10;

export function useScrollBehavior(
  scrollDate: ScrollDate,
  setScrollDate: CalendarProps['setScrollDate'],
  selfScrollDateSource: ScrollDate['source'],
  arith: ScrollArith,
  scheduleScroll: (cb: () => void) => void,
) {
  const [items, setItems] = useState(() => arith.getItems(scrollDate.date));
  const [scrollTop, setScrollTop] = useState(() => arith.getScrollTop(items, scrollDate.date));

  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollHandlingPausedRef = useRef(false);

  const syncStateToDate = useCallback(
    (newScrollDate: number | Date) => {
      const newItems = arith.getItems(newScrollDate);
      setItems(newItems);
      setScrollTop(arith.getScrollTop(newItems, newScrollDate));
      isScrollHandlingPausedRef.current = true;
    },
    [arith],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    container.scrollTop = scrollTop;

    const timeoutId = setTimeout(() => {
      isScrollHandlingPausedRef.current = false;
    }, RESUME_SCROLL_HANDLING_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [items, scrollTop]);

  const handleScroll = useCallback(() => {
    scheduleScroll(() => {
      if (isScrollHandlingPausedRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      const newScrollDate = arith.getScrollDate(items, container.scrollTop);
      setScrollDate({date: newScrollDate, source: selfScrollDateSource});

      if (!arith.isCenterItem(items, newScrollDate)) {
        syncStateToDate(newScrollDate);
      }
    });
  }, [scheduleScroll, arith, items, setScrollDate, selfScrollDateSource, syncStateToDate]);

  useEffect(() => {
    if (scrollDate.source === selfScrollDateSource) return;

    scheduleScroll(() => {
      syncStateToDate(scrollDate.date);
    });
  }, [scrollDate, selfScrollDateSource, scheduleScroll, syncStateToDate]);

  return {containerRef, handleScroll, items};
}
