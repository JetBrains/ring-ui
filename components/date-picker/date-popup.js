import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import calendarIcon from '@jetbrains/icons/calendar.svg';

import Icon from '../icon';
import memoize from '../global/memoize';

import DateInput from './date-input';
import Months from './months';
import Years from './years';
import Weekdays from './weekdays';
import {dateType, parseDate} from './consts';
import styles from './date-picker.css';

const scrollExpDelay = 10;

// eslint-disable-next-line react/no-deprecated
export default class DatePopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    date: dateType,
    range: PropTypes.bool,
    from: dateType,
    to: dateType,
    displayFormat: PropTypes.string,
    inputFormat: PropTypes.string,
    onChange: PropTypes.func,
    onComplete: PropTypes.func,
    onClear: PropTypes.func
  };

  static defaultProps = {
    onChange() {}
  };

  state = {
    text: null,
    hoverDate: null,
    scrollDate: null,
    active: null
  };

  componentWillMount() {
    const {range, from, to} = this.props;

    if (!range) {
      this.setState({active: 'date'});
    } else if (from && !to) {
      this.setState({active: 'to'});
    } else {
      this.setState({active: 'from'});
    }
  }

  componentWillReceiveProps(nextProps) {
    const name = this.state.active;
    if (nextProps[name] && !this.sameDay(this.props[name], nextProps[name])) {
      this.setState({text: null});
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

  sameDay(next, prev) {
    const nextMoment = this.parseDate(next);
    const prevMoment = this.parseDate(prev);
    if (nextMoment && prevMoment) {
      return nextMoment.isSame(prevMoment, 'day');
    }

    return next === prev;
  }

  parseDate(text) {
    return parseDate(
      text,
      this.props.inputFormat,
      this.props.displayFormat
    );
  }

  select(changes) {
    if (!this.props.range) {
      this.setState({
        text: null,
        scrollDate: null
      });
      this.props.onChange(changes.date);
      this.props.onComplete();
    } else {
      let {from, to} = {
        ...this.props,
        ...changes
      };
      from = this.parseDate(from);
      to = this.parseDate(to);

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
    this.select({
      [name]: this.parseDate(this.state.text) || this.props[name]
    });
  }

  scheduleScroll = () => {
    const current =
      this.state.scrollDate ||
      this.parseDate(this.props[this.state.active]) ||
      moment();
    const goal = this._scrollDate;
    if (!current || !goal || this.sameDay(goal, current)) {
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

  handleInput = text => {
    const scrollDate = this.parseDate(text);
    if (scrollDate) {
      this.scrollTo(scrollDate);
    }
    this.setState({
      text,
      hoverDate: null
    });
  };

  handleConfirm = memoize(name => () => this.confirm(name));

  selectHandler = date => this.select({[this.state.active]: date});

  handleScroll = scrollDate => this.setState({scrollDate});

  render() {
    const {range} = this.props;

    const names = range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      const date = this.props[key];
      return {
        ...obj,
        [key]: this.parseDate(date)
      };
    }, {});

    const activeDate = this.state.hoverDate || this.state.text && this.parseDate(this.state.text);

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

    const calendarProps = {
      ...this.props,
      ...this.state,
      ...dates,
      scrollDate: this.state.scrollDate || dates[this.state.active] || moment(),
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
              name={name}
              key={name}
              date={dates[name]}
              active={this.state.active === name}
              onActivate={this.handleActivate(name)}
              onInput={this.handleInput}
              onConfirm={this.handleConfirm(name)}
              onClear={name === 'from' ? null : this.props.onClear}
            />
          ))}
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
