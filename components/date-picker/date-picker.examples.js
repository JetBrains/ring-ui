import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import DatePicker from '../date-picker/date-picker';

export default {
  title: 'Components|Date Picker',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Allows picking a date or a date range. Uses [moment.js](http://momentjs.com/) under the hood. You may want to either [bundle only the needed locales](https://webpack.js.org/plugins/context-replacement-plugin/#newcontentresource-newcontentrecursive-newcontentregexp) or even to [ignore all of them](https://webpack.js.org/plugins/ignore-plugin/#ignore-moment-locales).',

    hermione: {
      actions: [
        {type: 'click', selector: 'button'},
        {
          type: 'capture',
          name: 'datePickerPopup',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]']
        }
      ]
    }
  }
};

export const singleDate = () => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = date => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate}/>
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

singleDate.story = {
  name: 'single date'
};

export const range = () => {
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
          <DatePicker from={this.state.from} to={this.state.to} onChange={this.setRange} range/>
        </div>
      );
    }
  }
  return <DatePickerExample/>;
};

range.story = {
  name: 'range'
};

export const clearable = () => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = date => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} clear/>
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

clearable.story = {
  name: 'clearable'
};

export const singleWithMinMax = () => {
  class DatePickerExample extends Component {
    state = {date: '01.02.19'};

    setDate = date => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <div>
            {'With min and max dates: '}
            <DatePicker
              date={this.state.date}
              onChange={this.setDate}
              clear
              minDate="25 January 2019"
              maxDate="5 February 2019"
            />
          </div>
          <div>
            {'Only with min date: '}
            <DatePicker
              date={this.state.date}
              onChange={this.setDate}
              clear
              minDate="25 January 2019"
            />
          </div>
          <div>
            {'Only with max date: '}
            <DatePicker
              date={this.state.date}
              onChange={this.setDate}
              clear
              maxDate="5 February 2019"
            />
          </div>
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

singleWithMinMax.story = {
  name: 'single with min-max dates'
};

export const rangeWithMinMax = () => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2019',
      to: '4 February 2019'
    };

    setRange = ({from, to}) => {
      this.setState({from, to});
    };

    render() {
      return (
        <div>
          <div>
            {'With min and max dates: '}
            <DatePicker
              from={this.state.from}
              to={this.state.to}
              onChange={this.setRange}
              clear
              minDate="25 January 2019"
              maxDate="5 February 2019"
              range
            />
          </div>
          <div>
            {'Only with min date: '}
            <DatePicker
              from={this.state.from}
              to={this.state.to}
              onChange={this.setRange}
              clear
              minDate="25 January 2019"
              range
            />
          </div>
          <div>
            {'Only with max date: '}
            <DatePicker
              from={this.state.from}
              to={this.state.to}
              onChange={this.setRange}
              clear
              maxDate="5 February 2019"
              range
            />
          </div>
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

rangeWithMinMax.story = {
  name: 'range with min-max dates'
};
