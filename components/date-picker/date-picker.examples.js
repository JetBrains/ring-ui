import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import DatePicker from '../date-picker/date-picker';

storiesOf('Components|Date Picker', module).
  addDecorator(reactDecorator()).
  addParameters({
    hermione: {
      actions: [
        {type: 'click', selector: 'button'},
        {type: 'capture', name: 'datePickerPopup', selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]']}
      ]
    }
  }).
  add('single date', () => {
    class DatePickerExample extends Component {
      state = {date: '01.01.18'};

      setDate = date => {
        this.setState({date});
      };

      render() {
        return (
          <div>
            <DatePicker
              date={this.state.date}
              onChange={this.setDate}
            />
          </div>
        );
      }
    }

    return <DatePickerExample/>;
  }).
  add('range', () => {
    class DatePickerExample extends Component {
      state = {
        from: '1 January 2018',
        to: '15 February 2018'
      };

      setRange = ({from, to}) => {
        this.setState({from, to});
      };

      render() {
        return (
          <div>
            <DatePicker
              from={this.state.from}
              to={this.state.to}
              onChange={this.setRange}
              range
            />
          </div>
        );
      }
    }
    return <DatePickerExample/>;
  }).
  add('clearable', () => {
    class DatePickerExample extends Component {
      state = {date: '01.01.18'};

      setDate = date => {
        this.setState({date});
      };

      render() {
        return (
          <div>
            <DatePicker
              date={this.state.date}
              onChange={this.setDate}
              clear
            />
          </div>
        );
      }
    }

    return <DatePickerExample/>;
  });
