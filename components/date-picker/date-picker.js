import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import RingComponent from '../ring-component/ring-component';
import DateInput from './date-input';
import Popup from '../popup/popup';

import {dateType} from './consts';
import formats from './formats.json';

import styles from './date-picker.css';

/**
 * @name Date Picker
 * @category Components
 * @framework React
 * @constructor
 * @description TODO add Date Picker description
 * @example
   <example name="date-picker">
     <file name="index.html">
       <div id="date-picker"></div>
     </file>

     <file name="index.js">
       import {render} from 'react-dom';
       import React, {Component} from 'react';
       import moment from 'moment';

       import DatePicker from 'ring-ui/components/date-picker/date-picker';

       const container = document.getElementById('date-picker');

       class DatePickerExample extends Component {
         state = {date: moment()}

         render() {
           return (
             <div>
               <DatePicker
                  date={this.state.date}
                  onChange={date => this.setState({date})}
               />
               <div>
                 {this.state.date.format('DD.MM.YYYY')}
               </div>
             </div>
           );
         }
       }

       render(<DatePickerExample />, container);
     </file>
   </example>
 */

const parsed = Object.create(null);

export default class DatePicker extends RingComponent {
  static defaultProps = {
    className: '',
    date: null,
    range: false,
    from: null,
    to: null,
    format: 'D MMMM YYYY',
    onChange() {}
  };

  static propTypes = {
    className: PropTypes.string,
    date: dateType,
    range: PropTypes.bool,
    from: dateType,
    to: dateType,
    format: PropTypes.string,
    onChange: PropTypes.func
  };

  state = {
    text: '',
    hoverDate: null,
    scrollDate: null,
    active: null
  };

  parseDate(text) {
    if (!(text in parsed)) {
      const extendedFormats = [
        this.props.format,
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
        active: null,
        text: ''
      });
      this.props.onChange(changes.date);
    }
  }

  confirm(name) {
    this.select({
      [name]: this.parseDate(this.state.text) || this.props[name],
    });
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
    const classes = classNames(
      styles.datePicker,
      {[styles.active]: this.state.active},
      this.props.className
    );

    return (
      <div
        className={classes}
      >
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
              this.setState(scrollDate ? {text, scrollDate} : {text});
            }}
            onConfirm={() => this.confirm(name)}
          />
        ))}
      </div>
    );
  }
}

