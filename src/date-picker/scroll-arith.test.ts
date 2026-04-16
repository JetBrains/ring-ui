import {addMonths} from 'date-fns/addMonths';
import {startOfMonth} from 'date-fns/startOfMonth';

import {ScrollArith} from './scroll-arith';
import units from './consts';

const ITEMS_AROUND = 2;
const ITEM_HEIGHT = 100;
const TEST_YEAR = 2024;
const VIEW_CENTER = units.calHeight / 2;

const arith = new ScrollArith({
  itemsAround: ITEMS_AROUND,
  floorToItem: startOfMonth,
  shiftItems: addMonths,
  getItemHeight: () => ITEM_HEIGHT,
});

function toStr(date: Date[]) {
  return date.map(d => d.toISOString());
}

describe('ScrollArith with months', () => {
  const febDate = new Date(TEST_YEAR, 1, 15);
  const items = arith.getItems(febDate);

  describe('getItems', () => {
    it('should return months around center month', () => {
      expect(toStr(items)).to.deep.equal(
        toStr([
          new Date(TEST_YEAR - 1, 11),
          new Date(TEST_YEAR, 0),
          new Date(TEST_YEAR, 1),
          new Date(TEST_YEAR, 2),
          new Date(TEST_YEAR, 3),
        ]),
      );
    });
  });

  describe('getScrollTop', () => {
    it('should calculate scrollTop for a mid date', () => {
      const midDate = new Date(TEST_YEAR, 1, 15, 12);
      const expectedScrollTop = (ITEMS_AROUND + 0.5) * ITEM_HEIGHT - VIEW_CENTER;

      expect(arith.getScrollTop(items, midDate, undefined)).to.be.closeTo(expectedScrollTop, 1e-7);
    });

    it('should calculate scrollTop when scrollDate is before the first item', () => {
      const beforeDate = addMonths(items[0], -10);
      const expectedScrollTop = -VIEW_CENTER;

      expect(arith.getScrollTop(items, beforeDate, undefined)).to.be.closeTo(expectedScrollTop, 1e-7);
    });

    it('should calculate scrollTop when scrollDate is after the last item', () => {
      const beforeDate = addMonths(items[0], 10);
      const expectedScrollTop = 2 * ITEMS_AROUND * ITEM_HEIGHT - VIEW_CENTER;

      expect(arith.getScrollTop(items, beforeDate, undefined)).to.be.closeTo(expectedScrollTop, 1e-7);
    });
  });

  describe('getScrollDate', () => {
    it('should return scrollDate between items 3 and 4', () => {
      const scrollTop = 3.5 * ITEM_HEIGHT - VIEW_CENTER;
      const expectedScrollDate = new Date(TEST_YEAR, 2, 16, 12);

      expect(Number(arith.getScrollDate(items, scrollTop, undefined))).to.be.closeTo(
        Number(expectedScrollDate),
        3600_000,
      );
    });

    it('should return last item for very high scrollTop', () => {
      expect(Number(arith.getScrollDate(items, ITEM_HEIGHT * 100, undefined))).to.equal(
        Number(items[items.length - 1]),
      );
    });
  });

  describe('isCenterItem', () => {
    it('should return true for center month', () => {
      expect(arith.isCenterItem(items, new Date(TEST_YEAR, 1, 3))).to.equal(true);
    });

    it('should return false for non-center month', () => {
      expect(arith.isCenterItem(items, new Date(TEST_YEAR, 2, 1))).to.equal(false);
    });
  });
});
