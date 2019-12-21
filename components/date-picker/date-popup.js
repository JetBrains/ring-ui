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
    const {range, from, to, time, withTime} = props;

    if (!range) {
      this.state = {...defaultState, active: withTime && !time ? 'time' : 'date'};
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
      const defaultTime = changes.date || date ? '00:00' : null;
      const changeToSubmit = {
        date: changes.date || date,
        time: changes.time || time || defaultTime
      };

      this.props.onChange(changeToSubmit);

      this.setState({
        text: null,
        scrollDate: null
      });
      if (this.state.active === 'time' && date && changes.time) {
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
      const date = this.parse(this.props.date, 'date');

      const emptyCase = date ? '00:00' : '';
      result = result || time || emptyCase;
    } else if (!this.isValidDate(result)) {
      result = this.props[name];
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

  handleConfirm = memoize(name => () => {
    const {withTime, range} = this.props;

    if (!range && withTime && this.state.active === 'date') {
      this.setState({
        active: 'time'
      });
    } else {
      this.confirm(name);
    }
  });

  selectHandler = date => {
    if (this.props.withTime && !this.props.range) {
      this.setState({
        active: 'date'
      }, () => this.select({date}));
    } else {
      this.select({[this.state.active]: date});
    }
  };

  handleScroll = scrollDate => this.setState({scrollDate});

  render() {
    const {range, hidden, withTime} = this.props;
    const time = this.parse(this.props.time, 'time');

    const names = range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      const date = this.props[key];
      return {
        ...obj,
        [key]: this.parse(date, key)
      };
    }, {});

    const activeDate =
      this.state.hoverDate ||
      this.state.text &&
      this.parse(this.state.text, 'date');

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
              name={name}
              key={name}
              date={dates[name]}
              active={this.state.active === name}
              hidden={hidden}
              onActivate={this.handleActivate(name)}
              onInput={this.handleInput}
              onConfirm={this.handleConfirm(name)}
              onClear={name === 'from' || withTime ? null : this.props.onClear}
            />
          ))}
          {
            withTime && !range ? (
              <DateInput
                {...this.props}
                {...this.state}
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
