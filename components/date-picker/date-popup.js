import React, {PropTypes} from 'react';
import moment from 'moment';

import RingComponent from '../ring-component/ring-component';
import DateInput from './date-input';
import Months from './months';

import {dateType} from './consts';
import formats from './formats.json';

import styles from './date-picker.css';
import '../popup/popup.scss';

const parsed = Object.create(null);

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
      this.setState({text: null});
      this.props.onChange(changes.date);
      this.props.onComplete();
    }
  }

  confirm(name) {
    this.select({
      [name]: this.parseDate(this.state.text) || this.props[name]
    });
  }

  scrollTo(scrollDate) {
    this.setState({scrollDate});
  }

  didMount() {
    this.setState({active: 'date'});
  }

  render() {
    const names = this.props.range ? ['from', 'to'] : ['date'];
    const dates = names.reduce((obj, key) => {
      const date = this.props[key];
      return {
        ...obj,
        [key]: this.parseDate(date)
      };
    }, {});

    const calendarProps = {
      ...this.props,
      ...this.state,
      scrollDate: this.state.scrollDate || dates[this.state.active] || moment(),
      activeDate: this.state.hoverDate || this.state.text && this.parseDate(this.state.text),
      onScroll: ::this.scrollTo
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
                this.setState({text});
              }}
              onConfirm={() => this.confirm(name)}
            />
          ))}
        </div>
        <div
          className={styles.calendar}
        >
          <Months
            {...calendarProps}
            onHover={hoverDate => this.setState({hoverDate})}
            onSelect={date => this.select({[this.state.active]: date})}
          />
        </div>
      </div>
    );
  }
}
