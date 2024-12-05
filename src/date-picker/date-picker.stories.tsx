import {Component} from 'react';
import {StoryFn} from '@storybook/react';
import {enUS} from 'date-fns/locale/en-US';

import {Size} from '../input/input';

import DatePicker, {DatePickerAttrs} from './date-picker';
import {DatePickerChange} from './consts';

const {size, inline} = DatePicker.defaultProps;

export default {
  title: 'Components/Date Picker',

  component: DatePicker,
  parameters: {
    notes: 'Allows picking a date or a date range. Uses [date-fns](https://date-fns.org) under the hood.',

    screenshots: {
      actions: [
        {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
        {
          type: 'capture',
          name: 'datePickerPopup',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
        },
      ],
    },
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/5b0d1f6c877adb4d06c959ef',
  },
  args: {
    size,
    inline,
  },
  argTypes: {
    size: {
      options: Object.keys(Size),
      control: {type: 'select'},
    },
  },
};

export const singleDate: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

singleDate.storyName = 'single date';

export const singleDateAndTime: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      date: '8 January 2018, 9:45',
    };

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} withTime clear {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

singleDateAndTime.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
      {
        type: 'capture',
        name: 'datePickerPopup',
        selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
      },
    ],
  },
};

singleDateAndTime.storyName = 'single date and time';

export const range: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      from: '1 January 2018',
      to: '15 February 2018',
    };

    setRange = ({from, to}: DatePickerChange) => {
      this.setState({from, to});
    };

    render() {
      return (
        <div>
          <DatePicker from={this.state.from} to={this.state.to} onChange={this.setRange} range {...args} />
        </div>
      );
    }
  }
  return <DatePickerExample />;
};

range.storyName = 'range';

export const clearable: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} clear {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

clearable.storyName = 'clearable';

export const singleWithMinMax: StoryFn<DatePickerAttrs> = args => {
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
            {...args}
          />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

singleWithMinMax.storyName = 'single with min-max dates';

export const singleWithMin: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {date: '01.02.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} clear minDate="25 January 2018" {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

singleWithMin.storyName = 'single with min date';

export const singleWithMax: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {date: '01.02.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} clear maxDate="5 February 2018" {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

singleWithMax.storyName = 'single with max date';

export const rangeWithMinMax: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2018',
      to: '4 February 2018',
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
            {...args}
          />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

rangeWithMinMax.storyName = 'range with min-max dates';

export const rangeWithMin: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2018',
      to: '4 February 2018',
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
            {...args}
          />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

rangeWithMin.storyName = 'range with min date';

export const rangeWithMax: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      from: '27 January 2018',
      to: '4 February 2018',
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
            {...args}
          />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

rangeWithMax.storyName = 'range with max date';

export const rangeWithCustomPlaceholders: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      from: undefined,
      to: undefined,
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
            {...args}
          />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

rangeWithCustomPlaceholders.storyName = 'range with customized placeholders';

rangeWithCustomPlaceholders.parameters = {
  screenshots: {skip: true},
};

export const renderInline: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {
      date: '8 January 2018, 9:45',
    };

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} onChange={this.setDate} withTime clear {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

renderInline.args = {
  inline: true,
};

renderInline.parameters = {
  screenshots: {skip: true},
};

renderInline.storyName = 'inline';

export const allSizes = () => {
  class DatePickerExample extends Component {
    state = {
      date: '8 January 2018, 9:45',
    };

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div style={{width: '100%'}} data-test="root">
          <div className="block">
            <span className="label">M</span>
            <DatePicker date={this.state.date} onChange={this.setDate} size={Size.M} />
          </div>
          <div className="block">
            <span className="label">L</span>
            <DatePicker date={this.state.date} onChange={this.setDate} size={Size.L} />
          </div>
          <div className="block">
            <span className="label">FULL</span>
            <DatePicker date={this.state.date} onChange={this.setDate} size={Size.FULL} />
          </div>
          <div className="block">
            <span className="label">AUTO</span>
            <DatePicker date={this.state.date} onChange={this.setDate} size={Size.AUTO} />
          </div>
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

allSizes.storyName = 'all sizes';
allSizes.parameters = {
  storyStyles: `
<style>
  .block {
    padding: 8px 0;
  }
  .label {
    display: block;
  }
</style>
      `,
  screenshots: {
    actions: [{type: 'capture', name: 'datepickers', selector: ['[data-test~=root]']}],
  },
};

export const startsFromSunday: StoryFn<DatePickerAttrs> = args => {
  class DatePickerExample extends Component {
    state = {date: '01.01.18'};

    setDate = (date: Date | null | undefined) => {
      this.setState({date});
    };

    render() {
      return (
        <div>
          <DatePicker date={this.state.date} locale={enUS} onChange={this.setDate} {...args} />
        </div>
      );
    }
  }

  return <DatePickerExample />;
};

startsFromSunday.storyName = 'starts on Sunday';
