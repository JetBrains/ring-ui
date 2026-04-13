import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {type CalendarProps, type ScrollDate} from './consts';
import {type ScrollArith} from './scroll-arith';
import scheduleRAF from '../global/schedule-raf';

const scheduleScroll = scheduleRAF();

export function useScrollBehavior(
  scrollDate: ScrollDate,
  onContainerScroll: CalendarProps['setScrollDate'],
  selfScrollDateSource: ScrollDate['source'],
  arith: ScrollArith,
) {
  const [items, setItems] = useState(() => arith.getItems(scrollDate.date));
  const [scrollTop, setScrollTop] = useState(() => arith.getScrollTop(items, scrollDate.date));

  const containerRef = useRef<HTMLDivElement>(null);

  const setState = useCallback(
    (newScrollDate: number | Date) => {
      const newItems = arith.getItems(newScrollDate);
      setItems(newItems);
      setScrollTop(arith.getScrollTop(newItems, newScrollDate));
    },
    [arith],
  );

  useEffect(
    function onScrollDateChange() {
      if (scrollDate.source === selfScrollDateSource) return;

      const timeoutId = setTimeout(() => {
        setState(scrollDate.date);
      });
      return () => clearTimeout(timeoutId);
    },
    [scrollDate, selfScrollDateSource, setState],
  );

  const lastScrollUpdateRef = useRef<{
    items: typeof items;
    containerScrollTop: number;
  } | null>(null);

  useLayoutEffect(
    function setContainerScrollFromState() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTop = scrollTop;
      lastScrollUpdateRef.current = {
        items,
        containerScrollTop: container.scrollTop, // Note: browser can round it, so we read it back from DOM
      };
    },
    [items, scrollTop],
  );

  const handleScroll = useCallback(() => {
    scheduleScroll(() => {
      const container = containerRef.current;
      if (!container) return;

      if (
        items === lastScrollUpdateRef.current?.items &&
        container.scrollTop === lastScrollUpdateRef.current?.containerScrollTop
      ) {
        return;
      }

      const newScrollDate = arith.getScrollDate(items, container.scrollTop);
      onContainerScroll({date: newScrollDate, source: selfScrollDateSource});

      if (!arith.isCenterItem(items, newScrollDate)) {
        setState(newScrollDate);
      }
    });
  }, [items, arith, onContainerScroll, selfScrollDateSource, setState]);

  return {containerRef, handleScroll, items};
}
