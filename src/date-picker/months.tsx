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

  const intersectionObserverHandle = useIntersectionObserver(containerRef);

  return (
    <div className={styles.months} ref={containerRef}>
      {items.map(month => (
        <Month {...props} month={month} key={+month} intersectionObserverHandle={intersectionObserverHandle} />
      ))}
    </div>
  );
}
