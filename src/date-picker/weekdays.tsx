import classNames from 'classnames';
import type {Locale} from 'date-fns';
import {getDay} from 'date-fns/getDay';
import {format} from 'date-fns/format';
import {setDay} from 'date-fns/setDay';
import {startOfDay} from 'date-fns/startOfDay';

import {getWeekStartsOn, shiftWeekArray, weekdays} from './consts';
import styles from './date-picker.css';

interface WeekdaysProps {
  locale: Locale | undefined;
}

export default function Weekdays(props: WeekdaysProps) {
  const days = shiftWeekArray(Object.values(weekdays), getWeekStartsOn(props.locale)).map(value =>
    startOfDay(setDay(new Date(), value)),
  );

  const {locale} = props;

  return (
    <div className={styles.weekdays}>
      {days.map(day => (
        <span
          className={classNames(styles.weekday, {
            [styles.weekend]: [weekdays.SA, weekdays.SU].includes(getDay(day)),
          })}
          key={+day}
        >
          {format(day, 'EEEEEE', {locale})}
        </span>
      ))}
    </div>
  );
}
