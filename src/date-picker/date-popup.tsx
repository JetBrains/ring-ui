/* eslint-disable max-lines */
import {Component} from 'react';
import * as React from 'react';
import {isAfter} from 'date-fns/isAfter';
import {isBefore} from 'date-fns/isBefore';
import {isSameDay} from 'date-fns/isSameDay';
import {startOfDay} from 'date-fns/startOfDay';
import {set} from 'date-fns';

import memoize from '../global/memoize';
import DateInput from './date-input';
import Months from './months';
import Years from './years';
import Weekdays from './weekdays';
import {
  type Dates,
  type DatePickerChange,
  type DatePopupBaseProps,
  type DateSpecificPopupProps,
  type DatePopupState,
  parseTime,
  type RangeSpecificPopupProps,
  type TimeSpecificPopupProps,
  type Field,
  type CalendarProps,
} from './consts';

import styles from './date-picker.css';

const scrollExpDelay = 10;

export type DatePopupProps = DatePopupBaseProps &
  (DateSpecificPopupProps | TimeSpecificPopupProps | RangeSpecificPopupProps);

export default class DatePopup extends Component<DatePopupProps, DatePopupState> {
  static sameDay(next: Date | number | null, prev: Date | number | null) {
    if (next && prev) {
      return isSameDay(next, prev);
    }

    return next === prev;
  }

  static defaultProps = {
    onChange() {},
  };

  constructor(props: DatePopupProps) {
    super(props);
    const defaultState = {
      text: null,
      hoverDate: null,
      scrollDate: null,
    };
    const {range, withTime} = props;

    if (!range) {
      const parsedDate = this.parse(props.date, 'date');
      const active = withTime && parsedDate && !props.time ? 'time' : 'date';

      this.state = {...defaultState, active};
    } else if (props.from && !props.to) {
      this.state = {...defaultState, active: 'to'};
    } else {
      this.state = {...defaultState, active: 'from'};
    }
  }

  componentDidMount() {
    if (this.componentRef.current) {
      this.componentRef.current.addEventListener('wheel', this.handleWheel);
    }
  }

  componentDidUpdate(prevProps: DatePopupBaseProps, prevState: DatePopupState) {
    if (this.state.active !== prevState.active) {
      if (this.state.text && prevState.active) {
        this.confirm(prevState.active);
      }
      this.setState({text: null});
    }
  }

  componentWillUnmount() {
    if (this.componentRef.current) {
      this.componentRef.current.removeEventListener('wheel', this.handleWheel);
    }
  }

  private _scrollDate?: number | null;
  private _scrollTS?: number | null;

  isInTimeMode = () => (!this.props.range && this.props.withTime) || false;

  componentRef = React.createRef<HTMLDivElement>();

  handleWheel = (e: WheelEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  parse(text: string | null | undefined, type: 'time'): string;
  parse(text: Date | number | string | null | undefined, type?: 'date' | 'from' | 'to'): Date;
  parse(text: Date | number | string | null | undefined, type?: Field) {
    if (type === 'time') {
      return parseTime(String(text));
    }
    return this.props.parseDateInput(text);
  }

  select(changes: DatePickerChange) {
    const {range, withTime} = this.props;
    const prevActive = this.state.active;

    if (!range && !withTime) {
      this.setState({
        text: null,
        scrollDate: null,
      });
      const adjustedDate =
        changes.date &&
        set(new Date(), {
          year: changes.date.getFullYear(),
          month: changes.date.getMonth(),
          date: changes.date.getDate(),
        });
      this.props.onChange(adjustedDate);
      this.props.onComplete();
    } else if (!range && withTime) {
      const date = this.parse(this.props.date, 'date');
      const time = this.parse(this.props.time, 'time');
      const changeToSubmit = {
        date: changes.date || date,
        time: changes.time || time,
      };

      this.setState({
        active: changes.date ? 'time' : 'date',
        text: null,
        scrollDate: null,
      });

      this.props.onChange(changeToSubmit);
      if (!changes.date && prevActive === 'time' && changeToSubmit.date && changeToSubmit.time) {
        this.props.onComplete();
      }
    } else {
      let {from, to} = {
        ...this.props,
        ...changes,
      };
      from = this.parse(from, 'from');
      to = this.parse(to, 'to');

      // proceed to setting the end by default
      let active: Field = 'to';
      let complete = false;

      // end is before beginning
      if (from && to && isAfter(startOfDay(from), startOfDay(to))) {
        // ignore the old end when beginning is changed
        if (changes.from) {
          to = null;

          // treat range as reverse when end is changed
        } else if (changes.to) {
          to = from;
          from = changes.to;
        }
      } else if (changes.to) {
        active = 'from';
        complete = !!from;
      }

      this.setState({
        active,
        hoverDate: null,
        text: null,
      });
      this.props.onChange({from, to});
      if (complete) {
        this.props.onComplete();
      }
    }
  }

  confirm(name: Field) {
    const text = this.state.text;

    let result;
    if (name === 'time') {
      result = this.parse(text, name);
      const time = this.parse('time' in this.props ? this.props.time : '', 'time');

      const emptyCase = this.state.active === 'time' ? '00:00' : null;
      result = result || time || emptyCase;
    } else {
      result = this.parse(text, name);
      if (!this.isValidDate(result)) {
        result = this.parse(name in this.props ? this.props[name] : '', name);
      }
    }

    this.select({
      [name]: result,
    });
  }

  isValidDate = (parsedText: Date) => {
    const minDate = this.parse(this.props.minDate, 'date');
    const maxDate = this.parse(this.props.maxDate, 'date');

    if (parsedText) {
      return !((minDate && isBefore(parsedText, minDate)) || (maxDate && isAfter(parsedText, maxDate)));
    }
    return false;
  };

  scheduleScroll = () => {
    const current =
      (this.state.scrollDate && this.parse(this.state.scrollDate, 'date')) ||
      this.parse(this.props[this.state.active], 'date') ||
      new Date();
    const goal = this._scrollDate;
    if (!current || !goal || DatePopup.sameDay(goal, current)) {
      this._scrollDate = null;
      this._scrollTS = null;
      return;
    }

    if (this._scrollTS) {
      const diff = goal - Number(current);
      const dt = Date.now() - this._scrollTS;
      const next = goal - diff * Math.E ** (-dt / scrollExpDelay);
      this.setState({scrollDate: next});
    }

    this._scrollTS = Date.now();
    window.requestAnimationFrame(this.scheduleScroll);
  };

  scrollTo = (scrollDate: number) => {
    this._scrollDate = scrollDate;
    if (!this._scrollTS) {
      this.scheduleScroll();
    }
  };

  hoverHandler = (hoverDate: Date) => this.setState({hoverDate});

  handleActivate = memoize((name: Field) => () => this.setState({active: name}));

  handleInput = (text: string, name: Field) => {
    if (name !== 'time') {
      const parsed = this.parse(text, name);
      if (this.isValidDate(parsed)) {
        this.scrollTo(Number(parsed));
      }
    }
    this.setState({
      text,
      hoverDate: null,
    });
  };

  handleConfirm = memoize((name: Field) => () => this.confirm(name));

  selectHandler = (date: Date) => {
    if (this.isInTimeMode()) {
      this.setState(
        {
          active: 'time',
        },
        () => this.select({date}),
      );
    } else {
      this.select({[this.state.active]: date});
    }
  };

  handleScroll = (scrollDate: number) => this.setState({scrollDate});

  onClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    let changes;

    if (this.props.range) {
      changes = {
        from: null,
        to: null,
      };
    } else {
      changes = {
        date: null,
      };
    }

    this.select(changes);
    this.props.onClear?.(e);
    this.componentRef.current?.querySelector('input')?.focus();
  };

  // eslint-disable-next-line complexity
  render() {
    const {range, withTime, locale} = this.props;
    const {from, to, date, time, ...restProps} = this.props;
    const parsedDate = this.parse(this.props.date, 'date');
    const parsedTo = this.parse(this.props.to, 'to');

    const names: ('from' | 'to' | 'date')[] = range ? ['from', 'to'] : ['date'];
    const dates: Dates = names.reduce((obj, key) => {
      const value = this.props[key];
      return {
        ...obj,
        [key]: this.parse(value, key),
      };
    }, {});

    const activeDate =
      this.state.active !== 'time'
        ? this.state.hoverDate || (this.state.text ? this.parse(this.state.text, 'date') : null)
        : this.state.hoverDate || null;

    const currentRange: [Date, Date] | null = (range && dates.from && dates.to && [dates.from, dates.to]) || null;
    let activeRange: [Date, Date] | null = null;
    if (range && activeDate) {
      switch (this.state.active) {
        case 'from':
          if (dates.to && isAfter(startOfDay(activeDate), startOfDay(dates.to))) {
            activeRange = [activeDate, dates.to];
          }

          break;
        case 'to':
          if (!dates.from) {
            break;
          }
          if (isBefore(startOfDay(activeDate), startOfDay(dates.from))) {
            activeRange = [activeDate, dates.from];
          } else {
            activeRange = [dates.from, activeDate];
          }

          break;
        default:
          break;
      }
    }

    const scrollDate =
      withTime && !range
        ? this.state.scrollDate || dates.date || new Date()
        : this.state.scrollDate || dates[this.state.active] || new Date();

    const calendarProps: CalendarProps = {
      ...restProps,
      ...dates,
      scrollDate,
      activeDate,
      currentRange,
      activeRange,
      onScroll: this.handleScroll,
      onScrollChange: this.scrollTo,
    };

    const clearable = Boolean(this.props.onClear);

    return (
      <div className={styles.datePopup} data-test='ring-date-popup' ref={this.componentRef}>
        <div className={styles.filterWrapper}>
          {names.map(name => {
            let onClear;

            if (clearable && name !== 'from' && !this.isInTimeMode()) {
              onClear = this.onClear.bind(this);
            }

            return (
              <DateInput
                {...this.props}
                {...this.state}
                divider={name === 'from' && (!!dates[name] || !!parsedTo)}
                name={name}
                key={name}
                date={dates[name]}
                active={this.state.active === name}
                onActivate={this.handleActivate(name)}
                onInput={this.handleInput}
                onConfirm={this.handleConfirm(name)}
                onClear={onClear}
                locale={locale}
              />
            );
          })}

          {this.isInTimeMode() ? (
            <DateInput
              {...this.props}
              text={this.state.text}
              divider={!!parsedDate}
              hoverDate={null}
              name={'time'}
              key={'time'}
              date={null}
              time={time}
              active={this.state.active === 'time'}
              onActivate={this.handleActivate('time')}
              onInput={this.handleInput}
              onConfirm={this.handleConfirm('time')}
              onClear={(clearable && this.onClear) || undefined}
              locale={locale}
            />
          ) : (
            ''
          )}
        </div>
        <Weekdays locale={locale} />
        <div className={styles.calendar}>
          <Months {...calendarProps} onHover={this.hoverHandler} onSelect={this.selectHandler} locale={locale} />
          <Years {...calendarProps} />
        </div>

        {this.props.renderAfterCalendar && this.props.renderAfterCalendar(this.state)}
      </div>
    );
  }
}
