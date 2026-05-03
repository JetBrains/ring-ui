import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {type Locale} from 'date-fns';

import units, {type CalendarProps, type ScrollDate} from './consts';
import {type ScrollArith} from './scroll-arith';
import useEventCallback from '../global/use-event-callback';

import type scheduleRAF from '../global/schedule-raf';

export function useScrollBehavior(
  scrollDate: ScrollDate,
  onContainerScroll: CalendarProps['setScrollDate'],
  locale: Locale | undefined,
  selfScrollDateSource: ScrollDate['source'],
  arith: ScrollArith,
  scheduleScroll: ReturnType<typeof scheduleRAF>,
) {
  const [items, setItems] = useState(() => arith.getItems(scrollDate.date));
  const [scrollTop, setScrollTop] = useState(() => arith.getScrollTop(items, scrollDate.date, locale));

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateSelfState = useEventCallback((newScrollDate: ScrollDate['date']) => {
    const newScrollTopOnExistingItems = arith.getScrollTop(items, newScrollDate, locale);
    if (isNearEdge(newScrollTopOnExistingItems, containerRef.current!)) {
      const {newItems, newScrollTop} = arith.getItemsAndScrollTop(newScrollDate, locale);
      setItems(newItems);
      setScrollTop(newScrollTop);
    } else {
      setScrollTop(newScrollTopOnExistingItems);
    }
  });

  const didMountRef = useRef(false);
  useEffect(
    function onExternalScrollDateChange() {
      if (!didMountRef.current) {
        didMountRef.current = true;
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      if (scrollDate.source === selfScrollDateSource) return;

      updateSelfState(scrollDate.date);
    },
    [scrollDate, selfScrollDateSource, updateSelfState],
  );

  const ignoreNextScrollEventRef = useRef<boolean>(true);

  useLayoutEffect(
    function setContainerScrollFromState() {
      const container = containerRef.current;
      if (!container) return;

      ignoreNextScrollEventRef.current = true;
      container.scrollTop = scrollTop;
    },
    [items, scrollTop],
  );

  const handleScroll = useEventCallback(() => {
    scheduleScroll(() => {
      const container = containerRef.current;
      if (!container) return;

      if (ignoreNextScrollEventRef.current) {
        ignoreNextScrollEventRef.current = false;
        return;
      }

      const currentScrollTop = container.scrollTop;
      const newScrollDate = arith.getScrollDate(items, currentScrollTop, locale);
      onContainerScroll({date: newScrollDate, source: selfScrollDateSource});

      if (isNearEdge(currentScrollTop, container)) {
        const {newItems, newScrollTop} = arith.getItemsAndScrollTop(newScrollDate, locale);
        setItems(newItems);
        setScrollTop(newScrollTop);
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

function isNearEdge(scrollTop: number, container: Element) {
  const scrollHeight = container.scrollHeight;
  // eslint-disable-next-line no-magic-numbers
  const scrollDistanceNearEdge = units.calHeight * 1.5;
  return scrollTop <= scrollDistanceNearEdge || scrollHeight - units.calHeight - scrollTop <= scrollDistanceNearEdge;
}
