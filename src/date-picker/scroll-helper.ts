import {useCallback, useLayoutEffect, useRef, useState} from 'react';

import units, {HALF} from './consts';
import scheduleRAF from '../global/schedule-raf';

/**
 * A scrolling util for months or years lists.
 * "Items" are the beginnings of months or years.
 */
interface ScrollHelperParams {
  itemsBack: number;
  getItem: (date: Date) => Date;
  addItems: (date: Date, delta: number) => Date;
  getItemHeight: (item: Date) => number;
}

export class ScrollHelper {
  #params: ScrollHelperParams;

  constructor(params: ScrollHelperParams) {
    this.#params = params;
  }

  getState(scrollDate: Date | number) {
    const items = this.getItems(scrollDate);
    const scrollTop = this.getScrollTop(items, scrollDate);
    return {items, scrollTop};
  }

  getItems(scrollDate: Date | number) {
    const midItem = this.#params.getItem(new Date(scrollDate));
    return Array.from({length: this.#params.itemsBack * 2 + 1}, (_, i) =>
      this.#params.addItems(midItem, i - this.#params.itemsBack),
    );
  }

  /**
   * Will put the scroll date in the middle of the calendar.
   */
  getScrollTop(items: Date[], scrollDate: Date | number) {
    const item = this.#params.getItem(new Date(scrollDate));
    const nextItem = this.#params.addItems(item, 1);
    const currentItemFraction = (Number(scrollDate) - Number(item)) / (Number(nextItem) - Number(item));
    const currentItemOffset = currentItemFraction * this.#params.getItemHeight(item);

    const currentItemIndex = items.findIndex(it => Number(it) === Number(item));
    const monthsBackHeight = items
      .slice(0, currentItemIndex)
      .reduce((h, itm) => h + this.#params.getItemHeight(itm), 0);

    return monthsBackHeight + currentItemOffset - units.calHeight * HALF;
  }

  /**
   * Returns the date which is in the middle of the calendar.
   */
  getScrollDate(items: Date[], scrollTop: number) {
    let monthsBackHeight = 0;
    for (const item of items) {
      const itemHeight = this.#params.getItemHeight(item);
      const currentItemOffset = scrollTop - (monthsBackHeight - units.calHeight * HALF);
      if (currentItemOffset < itemHeight) {
        const currentItemFraction = currentItemOffset / itemHeight;
        const nextItem = this.#params.addItems(item, 1);
        return new Date(Number(item) + currentItemFraction * (Number(nextItem) - Number(item)));
      }
      monthsBackHeight += itemHeight;
    }
    return items[items.length - 1];
  }

  isMidItem(items: Date[], scrollDate: Date | number) {
    const item = this.#params.getItem(new Date(scrollDate));
    const midItem = items[Math.floor(items.length / 2)];
    return Number(item) === Number(midItem);
  }
}

const SCROLL_HANDLE_RESUME_DELAY = 10;

const scheduleScroll = scheduleRAF();

export function useScrollBehavior({
  scrollDate,
  onScroll,
  scrollHelper,
}: {
  scrollDate: number | Date;
  onScroll: (to: number) => void;
  scrollHelper: ScrollHelper;
}) {
  const [scrollerState, setScrollerState] = useState(() => scrollHelper.getState(scrollDate));

  const componentRef = useRef<HTMLDivElement>(null);
  const pauseScrollHandlingRef = useRef(false);

  useLayoutEffect(() => {
    if (!componentRef.current) return undefined;

    componentRef.current.scrollTop = scrollerState.scrollTop;
    const timeoutId = setTimeout(() => {
      pauseScrollHandlingRef.current = false;
    }, SCROLL_HANDLE_RESUME_DELAY);
    return () => clearTimeout(timeoutId);
  }, [scrollerState]);

  const handleScroll = useCallback(() => {
    scheduleScroll(() => {
      if (pauseScrollHandlingRef.current) return;

      const scrollTop = componentRef.current?.scrollTop;
      if (scrollTop == null) return;

      const newScrollDate = scrollHelper.getScrollDate(scrollerState.items, scrollTop);
      onScroll(Number(newScrollDate));

      if (!scrollHelper.isMidItem(scrollerState.items, newScrollDate)) {
        setScrollerState(scrollHelper.getState(newScrollDate));
        pauseScrollHandlingRef.current = true;
      }
    });
  }, [onScroll, scrollerState, scrollHelper]);

  return {componentRef, handleScroll, items: scrollerState.items};
}
