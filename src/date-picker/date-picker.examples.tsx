import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import DatePicker from './date-picker';
import {DatePickerChange} from './consts';

export default {
  title: 'Components/Date Picker',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Allows picking a date or a date range. Uses [date-fns](https://date-fns.org) under the hood.',

    hermione: {
      actions: [
        {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
        {
          type: 'capture',
          name: 'datePickerPopup',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]']
        }
      ]
    },
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/5b0d1f6c877adb4d06c959ef'
  }
};

export const singleDate = () => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = (date: Date | null | undefined) => {
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

singleDate.storyName = 'single date';

export const singleDateAndTime = () => {
  class DatePickerExample extends Component {
    state = {
      date: '8 January 2020, 9:45'
    };

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker
            date={this.state.date}
            onChange={this.setDate}
            withTime
            clear
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

singleDateAndTime.parameters = {
  hermione: {
    actions: [
      {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
      {
        type: 'capture',
        name: 'datePickerPopup',
        selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]']
      }
    ]
  }
};

singleDateAndTime.storyName = 'single date and time';

export const range = () => {
  class DatePickerExample extends Component {
    state = {
      from: '1 January 2018',
      to: '15 February 2018'
    };

    setRange = ({from, to}: DatePickerChange) => {
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

range.storyName = 'range';

export const clearable = () => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = (date: Date | null | undefined) => {
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

clearable.storyName = 'clearable';

export const singleWithMinMax = () => {
  class DatePickerExample extends Component {
    state = {date: '01.02.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker
            date={this.state.date}
            onChange={this.setDate}
            clear
            minDate="25 January 2018"
            maxDate="5 February 2018"
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

singleWithMinMax.storyName = 'single with min-max dates';

export const singleWithMin = () => {
  class DatePickerExample extends Component {
    state = {date: '01.02.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker
            date={this.state.date}
            onChange={this.setDate}
            clear
            minDate="25 January 2018"
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

singleWithMin.storyName = 'single with min date';

export const singleWithMax = () => {
  class DatePickerExample extends Component {
    state = {date: '01.02.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker
            date={this.state.date}
            onChange={this.setDate}
            clear
            maxDate="5 February 2018"
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

singleWithMax.storyName = 'single with max date';

export const rangeWithMinMax = () => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2018',
      to: '4 February 2018'
    };

    setRange = ({from, to}: DatePickerChange) => {
      this.setState({from, to});
    };

    render() {
      return (
        <div>
          <DatePicker
            from={this.state.from}
            to={this.state.to}
            onChange={this.setRange}
            clear
            minDate="25 January 2018"
            maxDate="5 February 2018"
            range
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

rangeWithMinMax.storyName = 'range with min-max dates';

export const rangeWithMin = () => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2018',
      to: '4 February 2018'
    };

    setRange = ({from, to}: DatePickerChange) => {
      this.setState({from, to});
    };

    render() {
      return (
        <div>
          <DatePicker
            from={this.state.from}
            to={this.state.to}
            onChange={this.setRange}
            clear
            minDate="25 January 2018"
            range
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

rangeWithMin.storyName = 'range with min date';

export const rangeWithMax = () => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2018',
      to: '4 February 2018'
    };

    setRange = ({from, to}: DatePickerChange) => {
      this.setState({from, to});
    };

    render() {
      return (
        <div>
          <DatePicker
            from={this.state.from}
            to={this.state.to}
            onChange={this.setRange}
            clear
            maxDate="5 February 2018"
            range
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

rangeWithMax.storyName = 'range with max date';

export const rangeWithCustomPlaceholders = () => {
  class DatePickerExample extends Component {
    state = {
      from: undefined,
      to: undefined
    };

    setRange = ({from, to}: DatePickerChange) => {
      this.setState({from, to});
    };

    render() {
      return (
        <div>
          <DatePicker
            from={this.state.from}
            to={this.state.to}
            onChange={this.setRange}
            fromPlaceholder="From"
            toPlaceholder="To"
            rangePlaceholder="Set range"
            clear
            range
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

rangeWithCustomPlaceholders.storyName = 'range with customized placeholders';

rangeWithCustomPlaceholders.parameters = {
  hermione: {skip: true}
};

export const renderInline = () => {
  class DatePickerExample extends Component {
    state = {
      date: '8 January 2020, 9:45'
    };

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker
            date={this.state.date}
            onChange={this.setDate}
            withTime
            clear
            inline
          />
        </div>
      );
    }
  }

  return <DatePickerExample/>;
};

renderInline.parameters = {
  hermione: {skip: true}
};

renderInline.storyName = 'inline';
