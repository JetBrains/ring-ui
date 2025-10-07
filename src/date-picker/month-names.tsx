import {PureComponent} from 'react';
import classNames from 'classnames';
import {endOfMonth} from 'date-fns/endOfMonth';
import {format} from 'date-fns/format';
import {isThisMonth} from 'date-fns/isThisMonth';
import {set} from 'date-fns/set';
import {startOfDay} from 'date-fns/startOfDay';
import {startOfYear} from 'date-fns/startOfYear';

import linearFunction from '../global/linear-function';
import MonthSlider from './month-slider';
import {YEAR, MIDDLE_DAY, yearScrollSpeed, type MonthsProps} from './consts';

import type {Locale} from 'date-fns';

import styles from './date-picker.css';


interface MonthNameProps {
  month: Date;
  onScrollChange: (to: number) => void;
  locale: Locale | undefined;
}

class MonthName extends PureComponent<MonthNameProps> {
  handleClick = () => {
    const end = endOfMonth(this.props.month);
    this.props.onScrollChange(end.getTime());
  };

  render() {
    const {month, locale} = this.props;

    return (
      <button
        type='button'
        className={classNames(styles.monthName, {
          [styles.today]: isThisMonth(month),
        })}
        onClick={this.handleClick}
      >
        {format(month, 'LLL', {locale})}
      </button>
    );
  }
}

export default function MonthNames(props: MonthsProps) {
  const {scrollDate, locale} = props;
  const months = [];
  for (let i = 0; i < YEAR; i++) {
    const middleDay = set(scrollDate, {month: i, date: MIDDLE_DAY});
    months.push(startOfDay(middleDay));
  }

  const pxToDate = linearFunction(0, Number(startOfYear(scrollDate)), yearScrollSpeed);

  let top = 0;
  let bottom = 0;
  if (props.currentRange) {
    [top, bottom] = props.currentRange.map(date => Math.floor(pxToDate.x(Number(date))));
  }

  return (
    <div className={styles.monthNames}>
      {months.map(month => (
        <MonthName key={+month} month={month} onScrollChange={props.onScrollChange} locale={locale} />
      ))}
      {props.currentRange && (
        <div
          className={styles.range}
          style={{
            top: top - 1,
            height: bottom + 1 - (top - 1),
          }}
        />
      )}
      <MonthSlider {...props} pxToDate={pxToDate} />
    </div>
  );
}
