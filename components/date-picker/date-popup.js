import React, {PropTypes} from 'react';
import moment from 'moment';

import RingComponent from '../ring-component/ring-component';
import DateInput from './date-input';
import Months from './months';
import Years from './years';
import Weekdays from './weekdays';

import {dateType} from './consts';
import formats from './formats.json';

import styles from './date-picker.css';
import '../popup/popup.scss';

const parsed = Object.create(null);

const DELAYTIME = 10;

function sameDay(next, prev) {
  const nextMoment = moment(next);
  const prevMoment = moment(prev);
  if (nextMoment.isValid() && prevMoment.isValid()) {
    return nextMoment.isSame(prevMoment, 'day');
  }

  return next === prev;
}

export default class DatePopup extends RingComponent {
  static defaultProps = {
    className: '',
    date: null,
    range: false,
    from: null,
    to: null,
    displayFormat: 'D MMM YYYY',
    inputFormat: 'D MMMM YYYY',
    onChange() {}
  };

  static propTypes = {
    className: PropTypes.string,
    date: dateType,
    range: PropTypes.bool,
    from: dateType,
    to: dateType,
    displayFormat: PropTypes.string,
    inputFormat: PropTypes.string,
    onChange: PropTypes.func
  };

  state = {
    text: null,
    hoverDate: null,
    scrollDate: null,
    active: null
  };

  parseDate(text) {
    if (!(text in parsed)) {
      const extendedFormats = [
        this.props.inputFormat,
        this.props.displayFormat,
        ...formats
      ];
      const date = moment(text, extendedFormats);
      parsed[text] = date.isValid() ? date : null;
    }

    return parsed[text];
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

  scheduleScroll() {
    const current = this.state.scrollDate || this.props[this.state.active] || moment();
    const goal = this._scrollDate;
    if (!current || !goal || sameDay(goal, current)) {
      this._scrollDate = null;
      this._scrollTS = null;
      return;
    }

    if (this._scrollTS) {
      const diff = goal - current;
      const dt = moment() - this._scrollTS;
      const next = goal - diff * Math.E ** (-dt / DELAYTIME);
      this.setState({scrollDate: next});
    }

    this._scrollTS = moment();
    window.requestAnimationFrame(::this.scheduleScroll);
  }

  scrollTo(scrollDate) {
    this._scrollDate = scrollDate;
    if (!this._scrollTS) {
      this.scheduleScroll();
    }
  }

  didMount() {
    const {range, from, to} = this.props;

    if (!range) {
      this.setState({active: 'date'});
    } else if (from && !to) {
      this.setState({active: 'to'});
    } else {
      this.setState({active: 'from'});
    }
  }

  didUpdate(prevProps, prevState) {
    if (this.state.active !== prevState.active) {
      if (this.state.text && prevState.active) {
        this.confirm(prevState.active);
      }

      this.setState({text: null});
    }

    const name = this.state.active;
    if (this.props[name] && !sameDay(this.props[name], prevProps[name])) {
      this.setState({text: null});
    }
  }

  render() {
    const {range, from, to} = this.props;

    const names = range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      const date = this.props[key];
      return {
        ...obj,
        [key]: this.parseDate(date)
      };
    }, {});

    const activeDate = this.state.hoverDate || this.state.text && this.parseDate(this.state.text);

    const currentRange = range && from && to && [from, to];
    let activeRange = null;
    if (range && activeDate) {
      switch (this.state.active) {
        case 'from':
          if (to && !activeDate.isAfter(to, 'days')) {
            activeRange = [activeDate, to];
          }

          break;
        case 'to':
          if (!from) {
            break;
          }
          if (activeDate.isBefore(from, 'days')) {
            activeRange = [activeDate, from];
          } else {
            activeRange = [from, activeDate];
          }

          break;
        default:
          break;
      }
    }

    const calendarProps = {
      ...this.props,
      ...this.state,
      scrollDate: this.state.scrollDate || dates[this.state.active] || moment(),
      activeDate,
      currentRange,
      activeRange,
      onScroll: scrollDate => this.setState({scrollDate}),
      onScrollChange: ::this.scrollTo
    };

    return (
      <div className={styles.datePopup}>
        <div className="ring-popup__filter-wrapper">
          {names.map(name => (
            <DateInput
              {...this.props}
              {...this.state}
              key={name}
              date={dates[name]}
              active={this.state.active === name}
              onActivate={() => this.setState({active: name})}
              onInput={text => {
                const scrollDate = this.parseDate(text);
                scrollDate && this.scrollTo(scrollDate);
                this.setState({
                  text,
                  hoverDate: null
                });
              }}
              onConfirm={() => this.confirm(name)}
            />
          ))}
          <Weekdays />
        </div>
        <div
          className={styles.calendar}
        >
          <Months
            {...calendarProps}
            onHover={hoverDate => this.setState({hoverDate})}
            onSelect={date => this.select({[this.state.active]: date})}
          />
          <Years {...calendarProps}/>
        </div>
      </div>
    );
  }
}
