import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import calendarIcon from 'jetbrains-icons/calendar.svg';

import RingComponent from '../ring-component/ring-component';
import Popup from '../popup/popup';
import Button from '../button/button';
import DatePopup from './date-popup';

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
  static defaultProps = DatePopup.defaultProps;
  static propTypes = DatePopup.propTypes;

  display() {
    const {range, displayFormat, date} = this.props;
    if (!range) {
      return date && moment(date).format(displayFormat);
    } else {
      return '';
    }
  }

  createPopup() {
    this.popup = Popup.renderPopup(Popup.factory({
      hidden: true,
      autoRemove: false,
      anchorElement: this.node
    }));
  }

  updatePopup() {
    if (this.popup) {
      this.popup.rerender({
        children: (
          <DatePopup
            {...this.props}
            onComplete={::this.popup.hide}
          />
        )
      });
    }
  }

  handleClick(e) {
    if (!this.popup) {
      this.createPopup();
    }

    if (!this.popup.isVisible()) {
      this.popup.show(::this.updatePopup);
    }
  }

  didUpdate() {
    if (this.popup && this.popup.isVisible()) {
      this.updatePopup();
    }
  }

  render() {
    const classes = classNames(
      styles.datePicker,
      this.props.className
    );
    const displayClasses = classNames(
      styles.displayDate,
      {[styles.displayRange]: this.props.range}
    );

    return (
      <Button
        onClick={::this.handleClick}
        icon={calendarIcon}
        className={classes}
      >
        <span
          className={displayClasses}
        >{this.display()}</span>
      </Button>
    );
  }
}

