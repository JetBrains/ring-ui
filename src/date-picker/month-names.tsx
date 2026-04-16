import {PureComponent} from 'react';
import classNames from 'classnames';
import {format} from 'date-fns/format';
import {isThisMonth} from 'date-fns/isThisMonth';
import {startOfYear} from 'date-fns/startOfYear';
import {addMonths, getYear, startOfMonth, type Locale} from 'date-fns';

import linearFunction from '../global/linear-function';
import MonthSlider from './month-slider';
import {YEAR, MIDDLE_DAY, yearScrollSpeed, type MonthsProps, type ScrollDate} from './consts';
import {animateDate} from './animate-date';

import styles from './date-picker.css';

interface MonthNameProps {
  scrollDate: ScrollDate;
  monthIndex: number;
  locale: Locale | undefined;
  setScrollDate: (newScrollDate: ScrollDate) => void;
}

class MonthName extends PureComponent<MonthNameProps> {
  componentWillUnmount(): void {
    this.animationCleanup?.();
  }

  private animationCleanup: (() => void) | null = null;

  handleClick = () => {
    const start = startOfMonth(this.getMiddleDay(this.props.monthIndex));
    const nextStart = addMonths(start, 1);
    // Because the space between months belongs to the next month, we position the target month a bit to the top
    // eslint-disable-next-line no-magic-numbers
    const targetDate = new Date(0.4 * Number(start) + 0.6 * Number(nextStart));
    this.animationCleanup?.();
    this.animationCleanup = animateDate(this.props.scrollDate.date, targetDate, date => {
      this.props.setScrollDate({
        date,
        source: 'other',
      });
    });
  };

  private getMiddleDay(monthIndex: number) {
    return new Date(getYear(this.props.scrollDate.date), monthIndex, MIDDLE_DAY);
  }

  render() {
    const {monthIndex, locale} = this.props;
    const month = this.getMiddleDay(monthIndex);

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

const monthsIndices = Array.from({length: YEAR}, (_, i) => i);

export default function MonthNames(props: MonthsProps) {
  const {scrollDate, locale} = props;

  const pxToDate = linearFunction(0, Number(startOfYear(scrollDate.date)), yearScrollSpeed);

  let top = 0;
  let bottom = 0;
  if (props.currentRange) {
    [top, bottom] = props.currentRange.map(date => Math.floor(pxToDate.x(Number(date))));
  }

  return (
    <div className={styles.monthNames}>
      {monthsIndices.map(monthIndex => (
        <MonthName
          key={monthIndex}
          scrollDate={scrollDate}
          monthIndex={monthIndex}
          setScrollDate={props.setScrollDate}
          locale={locale}
        />
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
      <MonthSlider {...props} />
    </div>
  );
}
