import {addMonths} from 'date-fns/addMonths';
import {startOfMonth} from 'date-fns/startOfMonth';
import {type Locale} from 'date-fns';

import Month, {getMonthHeight} from './month';
import units, {type MonthsProps} from './consts';
import {ScrollArith} from './scroll-arith';
import {useScrollBehavior} from './use-scroll-behavior';
import scheduleRAF from '../global/schedule-raf';
import {useIntersectionObserver} from './use-intersection-observer';

import styles from './date-picker.css';

function getMonthHeightWithMargin(date: Date | number, locale: Locale | undefined) {
  return units.unit * 2 + getMonthHeight(date, locale);
}

const scrollArith = new ScrollArith({
  itemsAround: 60,
  floorToItem: startOfMonth,
  shiftItems: addMonths,
  getItemHeight: (item, locale) => getMonthHeightWithMargin(item, locale),
});

const scheduleScroll = scheduleRAF();

/**
 * In range selection (start/end dates across different months), the gap between months
 * is correctly background-filled only when both months are reported as visible.
 *
 * To avoid an unpainted gap at the viewport boundary, the next month must be reported
 * as visible slightly before it actually enters the viewport. We achieve this by
 * extending the IntersectionObserver scrollMargin.
 */
const intersectionObserverScrollMargin = units.cellSize * 2;

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

  const intersectionObserverHandle = useIntersectionObserver(containerRef, intersectionObserverScrollMargin);

  return (
    <div className={styles.months} ref={containerRef} data-test='ring-date-popup--months'>
      {items.map(month => (
        <Month {...props} month={month} key={+month} intersectionObserverHandle={intersectionObserverHandle} />
      ))}
    </div>
  );
}
