import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import startOfDay from 'date-fns/startOfDay';
import calendarIcon from '@jetbrains/icons/calendar';

import Icon from '../icon/icon';
import memoize from '../global/memoize';

import DateInput from './date-input';
import Months from './months';
import Years from './years';
import Weekdays from './weekdays';
import {dateType, parseTime} from './consts';
import styles from './date-picker.css';

const scrollExpDelay = 10;

export default class DatePopup extends Component {

  static sameDay(next, prev) {
    if (next && prev) {
      return isSameDay(next, prev);
    }

    return next === prev;
  }

  static propTypes = {
    className: PropTypes.string,
    date: dateType,
    range: PropTypes.bool,
    withTime: PropTypes.bool,
    time: PropTypes.string,
    from: dateType,
    to: dateType,
    renderAfterCalendar: PropTypes.func,
    displayFormat: PropTypes.func,
    parseDateInput: PropTypes.func,
    onChange: PropTypes.func,
    onComplete: PropTypes.func,
    onClear: PropTypes.func,
    minDate: dateType,
    maxDate: dateType,
    hidden: PropTypes.bool,
    fromPlaceholder: PropTypes.string,
    toPlaceholder: PropTypes.string,
    timePlaceholder: PropTypes.string,
    locale: PropTypes.object
  };

  static defaultProps = {
    onChange() {}
  };

  constructor(props) {
    super(props);
    const defaultState = {
      text: null,
      hoverDate: null,
      scrollDate: null
    };
    const {range, from, to, date, time, withTime} = props;

    if (!range) {
      const parsedDate = this.parse(date, 'date');
      const active = withTime && parsedDate && !time ? 'time' : 'date';

      this.state = {...defaultState, active};
    } else if (from && !to) {
      this.state = {...defaultState, active: 'to'};
    } else {
      this.state = {...defaultState, active: 'from'};
    }
  }

  componentDidMount() {
    if (this.componentRef.current) {
      this.componentRef.current.addEventListener('wheel', this.handleWheel, {passive: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
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

  isInTimeMode = () => !this.props.range && this.props.withTime || false;

  componentRef = React.createRef();

  handleWheel = e => {
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  parse(text, type) {
    if (type === 'time') {
      return parseTime(text);
    }
    return this.props.parseDateInput(text);
  }

  select(changes) {
    const {range, withTime} = this.props;
    const prevActive = this.state.active;
    const date = this.parse(this.props.date, 'date');
    const time = this.parse(this.props.time, 'time');

    if (!range && !withTime) {
      this.setState({
        text: null,
        scrollDate: null
      });
      this.props.onChange(changes.date);
      this.props.onComplete();
    } else if (!range && withTime) {
      const changeToSubmit = {
        date: changes.date || date,
        time: changes.time || time
      };

      this.setState({
        active: changes.date ? 'time' : 'date',
        text: null,
        scrollDate: null
      });

      this.props.onChange(changeToSubmit);
      if (
        !changes.date && prevActive === 'time' &&
        changeToSubmit.date && changeToSubmit.time
      ) {
        this.props.onComplete();
      }
    } else {
      let {from, to} = {
        ...this.props,
        ...changes
      };
      from = this.parse(from, 'from');
      to = this.parse(to, 'to');

      // proceed to setting the end by default
      let active = 'to';
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
        text: null
      });
      this.props.onChange({from, to});
      if (complete) {
        this.props.onComplete();
      }
    }
  }

  confirm(name) {
    const text = this.state.text;

    let result = this.parse(text, name);
    if (name === 'time') {
      const time = this.parse(this.props.time, 'time');

      const emptyCase = this.state.active === 'time' ? '00:00' : null;
      result = result || time || emptyCase;
    } else if (!this.isValidDate(result)) {
      result = this.parse(this.props[name], name);
    }

    this.select({
      [name]: result
    });
  }

  isValidDate = parsedText => {
    const minDate = this.parse(this.props.minDate, 'date');
    const maxDate = this.parse(this.props.maxDate, 'date');

    if (parsedText) {
      return (!(
        minDate && isBefore(parsedText, minDate) ||
        maxDate && isAfter(parsedText, maxDate)
      ));
    }
    return false;
  };

  scheduleScroll = () => {
    const current =
      this.state.scrollDate && this.parse(this.state.scrollDate, 'date') ||
      this.parse(this.props[this.state.active], 'date') ||
      new Date();
    const goal = this._scrollDate;
    if (!current ||
      !goal ||
      DatePopup.sameDay(goal, current)
    ) {
      this._scrollDate = null;
      this._scrollTS = null;
      return;
    }

    if (this._scrollTS) {
      const diff = goal - current;
      const dt = Date.now() - this._scrollTS;
      const next = goal - diff * (Math.E ** (-dt / scrollExpDelay));
      this.setState({scrollDate: next});
    }

    this._scrollTS = Date.now();
    window.requestAnimationFrame(this.scheduleScroll);
  };

  scrollTo = scrollDate => {
    this._scrollDate = scrollDate;
    if (!this._scrollTS) {
      this.scheduleScroll();
    }
  };

  hoverHandler = hoverDate => this.setState({hoverDate});

  handleActivate = memoize(name => () => this.setState({active: name}));

  handleInput = (text, name) => {
    const parsed = this.parse(text, name);
    if (name !== 'time' && this.isValidDate(parsed)) {
      this.scrollTo(parsed);
    }
    this.setState({
      text,
      hoverDate: null
    });
  };

  handleConfirm = memoize(name => () => this.confirm(name));

  selectHandler = date => {
    if (this.isInTimeMode()) {
      this.setState({
        active: 'time'
      }, () => this.select({date}));
    } else {
      this.select({[this.state.active]: date});
    }
  };

  handleScroll = scrollDate => this.setState({scrollDate});

  onClear = e => {
    let changes;

    if (this.props.range) {
      changes = {
        from: null,
        to: null
      };

    } else {
      changes = {
        date: null
      };
    }

    this.select(changes);
    this.props.onClear(e);
  };

  render() {
    const {range, hidden, withTime, time, locale} = this.props;
    const parsedDate = this.parse(this.props.date, 'date');
    const parsedTo = this.parse(this.props.to, 'to');

    const names = range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      const date = this.props[key];
      return {
        ...obj,
        [key]: this.parse(date, key)
      };
    }, {});

    const activeDate = this.state.active !== 'time'
      ? this.state.hoverDate || this.state.text && this.parse(this.state.text, 'date')
      : this.state.hoverDate || null;

    const currentRange = range && dates.from && dates.to && [dates.from, dates.to] || null;
    let activeRange = null;
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

    const scrollDate = withTime && !range
      ? this.state.scrollDate || dates.date || new Date()
      : this.state.scrollDate || dates[this.state.active] || new Date();

    const calendarProps = {
      ...this.props,
      ...this.state,
      ...dates,
      scrollDate,
      activeDate,
      currentRange,
      activeRange,
      onScroll: this.handleScroll,
      onScrollChange: this.scrollTo
    };

    const clearable = Boolean(this.props.onClear);

    return (
      <div
        className={styles.datePopup}
        data-test="ring-date-popup"
        ref={this.componentRef}
      >
        <div className={styles.filterWrapper}>
          <Icon
            glyph={calendarIcon}
            className={styles.filterIcon}
          />

          {names.map(name => {
            let onClear;

            if (clearable && name !== 'from' && !this.isInTimeMode()) {
              onClear = this.onClear.bind(this);
            }

            return (
              <DateInput
                {...this.props}
                {...this.state}
                divider={name === 'from' && (dates[name] != null || parsedTo != null)}
                name={name}
                key={name}
                date={dates[name]}
                active={this.state.active === name}
                hidden={hidden}
                onActivate={this.handleActivate(name)}
                onInput={this.handleInput}
                onConfirm={this.handleConfirm(name)}
                onClear={onClear}
                locale={locale}
              />
            );
          })}

          {
            this.isInTimeMode()
              ? (
                <DateInput
                  {...this.props}
                  {...this.state}
                  divider={!!parsedDate}
                  hoverDate={null}
                  name={'time'}
                  key={'time'}
                  date={null}
                  time={time}
                  active={this.state.active === 'time'}
                  hidden={hidden}
                  onActivate={this.handleActivate('time')}
                  onInput={this.handleInput}
                  onConfirm={this.handleConfirm('time')}
                  onClear={clearable && this.onClear || undefined}
                  locale={locale}
                />
              )
              : ('')
          }
        </div>
        <Weekdays locale={locale}/>
        <div
          className={styles.calendar}
        >
          <Months
            {...calendarProps}
            onHover={this.hoverHandler}
            onSelect={this.selectHandler}
            locale={locale}
          />
          <Years {...calendarProps}/>
        </div>

        {this.props.renderAfterCalendar && this.props.renderAfterCalendar(this.state)}
      </div>
    );
  }
}
