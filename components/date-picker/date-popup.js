import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import calendarIcon from '@jetbrains/icons/calendar.svg';

import Icon from '../icon/icon';
import memoize from '../global/memoize';

import DateInput from './date-input';
import Months from './months';
import Years from './years';
import Weekdays from './weekdays';
import {dateType, parseDate, parseTime} from './consts';
import styles from './date-picker.css';

const scrollExpDelay = 10;

export default class DatePopup extends Component {

  static sameDay(next, prev, inputFormat, displayFormat) {
    const nextMoment = parseDate(next, inputFormat, displayFormat);
    const prevMoment = parseDate(prev, inputFormat, displayFormat);
    if (nextMoment && prevMoment) {
      return nextMoment.isSame(prevMoment, 'day');
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
    displayFormat: PropTypes.string,
    inputFormat: PropTypes.string,
    onChange: PropTypes.func,
    onComplete: PropTypes.func,
    onClear: PropTypes.func,
    minDate: dateType,
    maxDate: dateType,
    hidden: PropTypes.bool
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
      const parsedTime = this.parse(time, 'time');
      const parsedDate = this.parse(date, 'date');
      const active = withTime && parsedDate && !parsedTime ? 'time' : 'date';

      this.state = {...defaultState, active};
    } else if (from && !to) {
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.active !== prevState.active) {
      if (this.state.text && prevState.active) {
        this.confirm(prevState.active);
      }
      // eslint-disable-next-line react/no-did-update-set-state
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
    e.preventDefault();
  };

  parse(text, type) {
    return (type === 'time')
      ? parseTime(text)
      : parseDate(text, this.props.inputFormat, this.props.displayFormat);
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
      if (from && to && from.isAfter(to, 'days')) {
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
        minDate && parsedText.isBefore(minDate) ||
        maxDate && parsedText.isAfter(maxDate)
      ));
    }
    return false;
  };

  scheduleScroll = () => {
    const current =
      this.state.scrollDate ||
      this.parse(this.props[this.state.active], 'date') ||
      moment();
    const goal = this._scrollDate;
    if (!current ||
      !goal ||
      DatePopup.sameDay(goal, current, this.props.inputFormat, this.props.displayFormat)
    ) {
      this._scrollDate = null;
      this._scrollTS = null;
      return;
    }

    if (this._scrollTS) {
      const diff = goal - current;
      const dt = moment() - this._scrollTS;
      const next = goal - diff * (Math.E ** (-dt / scrollExpDelay));
      this.setState({scrollDate: next});
    }

    this._scrollTS = moment();
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

  render() {
    const {range, hidden, withTime} = this.props;
    const parsedTime = this.parse(this.props.time, 'time');
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
          if (dates.to && !activeDate.isAfter(dates.to, 'days')) {
            activeRange = [activeDate, dates.to];
          }

          break;
        case 'to':
          if (!dates.from) {
            break;
          }
          if (activeDate.isBefore(dates.from, 'days')) {
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
      ? this.state.scrollDate || dates.date || moment()
      : this.state.scrollDate || dates[this.state.active] || moment();

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
          {names.map(name => (
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
              onClear={name === 'from' || this.isInTimeMode() ? null : this.props.onClear}
            />
          ))}
          {
            this.isInTimeMode() ? (
              <DateInput
                {...this.props}
                {...this.state}
                divider={!!parsedDate}
                hoverDate={null}
                name={'time'}
                key={'time'}
                date={null}
                time={parsedTime}
                active={this.state.active === 'time'}
                hidden={hidden}
                onActivate={this.handleActivate('time')}
                onInput={this.handleInput}
                onConfirm={this.handleConfirm('time')}
                onClear={this.props.onClear}
              />
            ) : (
              ''
            )
          }
        </div>
        <Weekdays/>
        <div
          className={styles.calendar}
        >
          <Months
            {...calendarProps}
            onHover={this.hoverHandler}
            onSelect={this.selectHandler}
          />
          <Years {...calendarProps}/>
        </div>
      </div>
    );
  }
}
