import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {type Locale} from 'date-fns';

import {type CalendarProps, type ScrollDate} from './consts';
import {type ScrollArith} from './scroll-arith';
import scheduleRAF from '../global/schedule-raf';
import useEventCallback from '../global/use-event-callback';

const scheduleScroll = scheduleRAF();

export function useScrollBehavior(
  scrollDate: ScrollDate,
  onContainerScroll: CalendarProps['setScrollDate'],
  selfScrollDateSource: ScrollDate['source'],
  arith: ScrollArith,
  locale: Locale | undefined,
) {
  const [items, setItems] = useState(() => arith.getItems(scrollDate.date));
  const [scrollTop, setScrollTop] = useState(() => arith.getScrollTop(items, scrollDate.date, locale));

  const setState = useEventCallback((newScrollDate: number | Date) => {
    const newItems = arith.getItems(newScrollDate);
    if (!areEqual(items, newItems)) setItems(newItems);

    setScrollTop(arith.getScrollTop(newItems, newScrollDate, locale));
  });

  const mountedRef = useRef(false);
  useEffect(
    function onScrollDateChange() {
      if (!mountedRef.current) {
        mountedRef.current = true;
        return;
      }

      if (scrollDate.source === selfScrollDateSource) return;

      setState(scrollDate.date);
    },
    [scrollDate, selfScrollDateSource, setState],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef<number | null>(null);

  useLayoutEffect(
    function setContainerScrollFromState() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTop = scrollTop;
      lastScrollTopRef.current = container.scrollTop; // Note: browser can round it, so we read it back from DOM
    },
    [items, scrollTop],
  );

  const handleScroll = useEventCallback(() => {
    scheduleScroll(() => {
      const container = containerRef.current;
      if (!container) return;

      if (container.scrollTop === lastScrollTopRef.current) return;

      const newScrollDate = arith.getScrollDate(items, container.scrollTop, locale);
      onContainerScroll({date: newScrollDate, source: selfScrollDateSource});

      if (!arith.isCenterItem(items, newScrollDate)) {
        setState(newScrollDate);
      }
    });
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {containerRef, items};
}

function areEqual(a: Date[], b: Date[]) {
  return a.length === b.length && a.every((d, i) => Number(d) === Number(b[i]));
}
