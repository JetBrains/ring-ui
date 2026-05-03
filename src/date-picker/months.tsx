import {addMonths} from 'date-fns/addMonths';
import {startOfMonth} from 'date-fns/startOfMonth';
import {type Locale} from 'date-fns';

import Month, {getVisualMonthDays} from './month';
import units, {FIFTH_DAY, type MonthsProps, WEEK} from './consts';
import {ScrollArith} from './scroll-arith';
import {useScrollBehavior} from './scroll-behavior';
import scheduleRAF from '../global/schedule-raf';
import {ScrollListShape} from './scroll-list-shape';

import styles from './date-picker.css';

// eslint-disable-next-line no-magic-numbers
const listShape = new ScrollListShape(1, 5);

function monthHeight(date: Date | number, locale: Locale | undefined) {
  const marginTop = units.unit * 2;

  const monthNameCells = FIFTH_DAY;
  const cellsTotal = monthNameCells + getVisualMonthDays(new Date(date), locale).daysNumber;
  const monthLines = Math.ceil(cellsTotal / WEEK);

  return marginTop + monthLines * units.cellSize;
}

const EMPTY_MONTH_HEIGHT = units.calHeight;

const scrollArith = new ScrollArith({
  itemsAround: listShape.getItemsAround(),
  floorToItem: startOfMonth,
  shiftItems: addMonths,
  getItemHeight: (item, index, locale) =>
    listShape.isNotEmpty(index) ? monthHeight(item, locale) : EMPTY_MONTH_HEIGHT,
});

const scheduleScroll = scheduleRAF();

export default function Months(props: MonthsProps) {
  const {scrollDate, setScrollDate, locale} = props;

  const {containerRef, items} = useScrollBehavior(
    scrollDate,
    setScrollDate,
    locale,
    'monthsScroll',
    scrollArith,
    scheduleScroll,
  );

  return (
    <div className={styles.months} ref={containerRef}>
      {items.map((month, i) =>
        listShape.isNotEmpty(i) ? (
          <Month {...props} month={month} key={+month} />
        ) : (
          <div style={{height: EMPTY_MONTH_HEIGHT}} key={listShape.getEmptyKey(i)} />
        ),
      )}
    </div>
  );
}
