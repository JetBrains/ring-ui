import units, {HALF} from './consts';

/**
 * Scroll math helper for month/year scrollers.
 *
 * An "item" is a floor-boundary date representing the start of a visible period
 * (e.g. start of a month or start of a year).
 */
export class ScrollArith {
  #itemsAround: number;
  #floorToItem: (date: Date) => Date;
  #shiftItem: (date: Date, delta: number) => Date;
  #getItemHeight: (item: Date, index: number, items: Date[]) => number;

  constructor(params: {
    itemsAround: number;
    floorToItem: (date: Date) => Date;
    shiftItems: (date: Date, delta: number) => Date;
    getItemHeight: (item: Date, index: number, items: Date[]) => number;
  }) {
    this.#itemsAround = params.itemsAround;
    this.#floorToItem = params.floorToItem;
    this.#shiftItem = params.shiftItems;
    this.#getItemHeight = params.getItemHeight;
  }

  /**
   * Builds a symmetric list of items centered around the given scrollDate.
   */
  getItems(scrollDate: Date | number) {
    const centerItem = this.#floorToItem(new Date(scrollDate));
    return Array.from({length: 1 + this.#itemsAround * 2}, (_, index) =>
      this.#shiftItem(centerItem, index - this.#itemsAround),
    );
  }

  /**
   * Computes the scroll offset which places the `scrollDate` at the vertical center.
   */
  getScrollTop(items: Date[], scrollDate: Date | number) {
    const item = this.#floorToItem(new Date(scrollDate));
    const nextItem = this.#shiftItem(item, 1);

    let index = items.findIndex(it => Number(it) === Number(item));
    if (index === -1) {
      index = Number(item) < Number(items[0]) ? 0 : items.length - 1;
    }

    const itemFraction = (Number(scrollDate) - Number(item)) / (Number(nextItem) - Number(item));
    const offsetWithinItem = itemFraction * this.#getItemHeight(item, index, items);

    const heightBeforeItem = items
      .slice(0, index)
      .reduce((totalHeight, it, i) => totalHeight + this.#getItemHeight(it, i, items), 0);

    return heightBeforeItem + offsetWithinItem - units.calHeight * HALF;
  }

  /**
   * Returns the date currently located in the vertical center of the calendar.
   */
  getScrollDate(items: Date[], scrollTop: number) {
    let heightBeforeItem = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemHeight = this.#getItemHeight(item, i, items);
      const offsetWithinItem = scrollTop - heightBeforeItem + units.calHeight * HALF;
      if (offsetWithinItem < itemHeight) {
        const itemFraction = offsetWithinItem / itemHeight;
        const nextItem = this.#shiftItem(item, 1);
        return new Date(Number(item) + itemFraction * (Number(nextItem) - Number(item)));
      }
      heightBeforeItem += itemHeight;
    }
    return items[items.length - 1];
  }

  isCenterItem(items: Date[], scrollDate: Date | number) {
    const item = this.#floorToItem(new Date(scrollDate));
    const centerItem = items[Math.floor(items.length / 2)];
    return Number(item) === Number(centerItem);
  }
}
