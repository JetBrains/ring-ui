import {createRef, PureComponent} from 'react';
import classNames from 'classnames';
import {addYears} from 'date-fns/addYears';
import {getYear} from 'date-fns/getYear';
import {format} from 'date-fns/format';
import {isSameYear} from 'date-fns/isSameYear';
import {isThisYear} from 'date-fns/isThisYear';
import {setYear} from 'date-fns/setYear';
import {startOfYear} from 'date-fns/startOfYear';
import {subYears} from 'date-fns/subYears';

import linearFunction from '../global/linear-function';
import styles from './date-picker.css';
import units, {type CalendarProps, DOUBLE, HALF, yearDuration} from './consts';

const {yearHeight, calHeight} = units;

let scrollTO: number | null;

const YEARSBACK = 5;
const scrollDelay = 100;

interface YearsState {
  scrollDate: Date | null;
}

export default class Years extends PureComponent<CalendarProps> {
  state = {scrollDate: null};

  componentDidMount() {
    if (this.componentRef.current) {
      this.componentRef.current.addEventListener('wheel', this.handleWheel);
    }
  }

  componentDidUpdate(prevProps: CalendarProps, prevState: YearsState) {
    this.stoppedScrolling = !!prevState.scrollDate && !this.state.scrollDate;
  }

  componentWillUnmount() {
    if (this.componentRef.current) {
      this.componentRef.current.removeEventListener('wheel', this.handleWheel);
    }
  }

  stoppedScrolling?: boolean;
  setYear(date: number) {
    if (scrollTO) {
      window.clearTimeout(scrollTO);
      scrollTO = null;
    }

    this.setState({scrollDate: null});

    this.props.onScroll(Number(setYear(this.props.scrollDate, getYear(date))));
  }

  componentRef = createRef<HTMLDivElement>();

  handleWheel = (e: WheelEvent) => {
    const {scrollDate} = this.props;
    const date = this.state.scrollDate || scrollDate;

    e.preventDefault();
    const newScrollDate = linearFunction(0, Number(date), yearDuration / yearHeight).y(e.deltaY);
    this.setState({
      scrollDate: newScrollDate,
    });
    if (scrollTO) {
      window.clearTimeout(scrollTO);
    }
    scrollTO = window.setTimeout(() => this.setYear(newScrollDate), scrollDelay);
  };

  render() {
    const {onScrollChange, scrollDate} = this.props;
    const date = this.state.scrollDate || scrollDate;
    const yearStart = startOfYear(date);
    let year = subYears(yearStart, YEARSBACK);
    const years = [year];
    for (let i = 0; i < YEARSBACK * DOUBLE; i++) {
      year = addYears(year, 1);
      years.push(year);
    }

    const pxToDate = linearFunction(0, Number(years[0]), yearDuration / yearHeight);

    return (
      <div
        className={styles.years}
        ref={this.componentRef}
        style={{
          transition: this.stoppedScrolling ? 'top .2s ease-out 0s' : 'none',
          top: Math.floor(calHeight * HALF - pxToDate.x(Number(date))),
        }}
      >
        {years.map(item => (
          <button
            type='button'
            key={+item}
            className={classNames(styles.year, {
              [styles.currentYear]: isSameYear(item, date),
              [styles.today]: isThisYear(item),
            })}
            onClick={function handleClick() {
              onScrollChange(Number(setYear(scrollDate, getYear(item))));
            }}
          >
            {format(item, 'yyyy')}
          </button>
        ))}
      </div>
    );
  }
}
