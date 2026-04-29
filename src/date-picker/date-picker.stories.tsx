import {useState} from 'react';
import {type StoryFn} from '@storybook/react-webpack5';
import {enUS} from 'date-fns/locale/en-US';

import {Size} from '../input/input';
import DatePicker, {type DatePickerAttrs} from './date-picker';
import {type DatePickerChange} from './consts';

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

export const SingleDate: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.01.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} {...args} />
    </div>
  );
};

SingleDate.storyName = 'single date';

export const SingleDateAndTime: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('8 January 2018, 9:45');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} withTime clear {...args} />
    </div>
  );
};

SingleDateAndTime.parameters = {
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

SingleDateAndTime.storyName = 'single date and time';

export const Range: StoryFn<DatePickerAttrs> = args => {
  const [{from, to}, setRange] = useState<{
    from: Date | string | null | undefined;
    to: Date | string | null | undefined;
  }>({
    from: '1 January 2018',
    to: '15 February 2018',
  });

  const handleChange = (change: DatePickerChange) => setRange(prev => ({...prev, ...change}));

  return (
    <div>
      <DatePicker from={from} to={to} onChange={handleChange} range {...args} />
    </div>
  );
};

Range.storyName = 'range';

export const Clearable: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.01.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} clear {...args} />
    </div>
  );
};

Clearable.storyName = 'clearable';

export const SingleWithMinMax: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.02.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} clear minDate='25 January 2018' maxDate='5 February 2018' {...args} />
    </div>
  );
};

SingleWithMinMax.storyName = 'single with min-max dates';

export const SingleWithMin: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.02.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} clear minDate='25 January 2018' {...args} />
    </div>
  );
};

SingleWithMin.storyName = 'single with min date';

export const SingleWithMax: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.02.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} clear maxDate='5 February 2018' {...args} />
    </div>
  );
};

SingleWithMax.storyName = 'single with max date';

export const RangeWithMinMax: StoryFn<DatePickerAttrs> = args => {
  const [{from, to}, setRange] = useState<{
    from: Date | string | null | undefined;
    to: Date | string | null | undefined;
  }>({
    from: '27 January 2018',
    to: '4 February 2018',
  });

  const handleChange = (change: DatePickerChange) => setRange(prev => ({...prev, ...change}));

  return (
    <div>
      <DatePicker
        from={from}
        to={to}
        onChange={handleChange}
        clear
        minDate='25 January 2018'
        maxDate='5 February 2018'
        range
        {...args}
      />
    </div>
  );
};

RangeWithMinMax.storyName = 'range with min-max dates';

export const RangeWithMin: StoryFn<DatePickerAttrs> = args => {
  const [{from, to}, setRange] = useState<{
    from: Date | string | null | undefined;
    to: Date | string | null | undefined;
  }>({
    from: '27 January 2018',
    to: '4 February 2018',
  });

  const handleChange = (change: DatePickerChange) => setRange(prev => ({...prev, ...change}));

  return (
    <div>
      <DatePicker from={from} to={to} onChange={handleChange} clear minDate='25 January 2018' range {...args} />
    </div>
  );
};

RangeWithMin.storyName = 'range with min date';

export const RangeWithMax: StoryFn<DatePickerAttrs> = args => {
  const [{from, to}, setRange] = useState<{
    from: Date | string | null | undefined;
    to: Date | string | null | undefined;
  }>({
    from: '27 January 2018',
    to: '4 February 2018',
  });

  const handleChange = (change: DatePickerChange) => setRange(prev => ({...prev, ...change}));

  return (
    <div>
      <DatePicker from={from} to={to} onChange={handleChange} clear maxDate='5 February 2018' range {...args} />
    </div>
  );
};

RangeWithMax.storyName = 'range with max date';

export const RangeWithCustomPlaceholders: StoryFn<DatePickerAttrs> = args => {
  const [{from, to}, setRange] = useState<{
    from: Date | string | null | undefined;
    to: Date | string | null | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleChange = (change: DatePickerChange) => setRange(prev => ({...prev, ...change}));

  return (
    <div>
      <DatePicker
        from={from}
        to={to}
        onChange={handleChange}
        fromPlaceholder='From'
        toPlaceholder='To'
        rangePlaceholder='Set range'
        clear
        range
        {...args}
      />
    </div>
  );
};

RangeWithCustomPlaceholders.storyName = 'range with customized placeholders';

RangeWithCustomPlaceholders.parameters = {
  screenshots: {skip: true},
};

export const RenderInline: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('8 January 2018, 9:45');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} withTime clear {...args} />
    </div>
  );
};

RenderInline.args = {
  inline: true,
};

RenderInline.parameters = {
  screenshots: {skip: true},
};

RenderInline.storyName = 'inline';

export const AllSizes = () => {
  const [date, setDate] = useState<Date | string | null | undefined>('8 January 2018, 9:45');

  return (
    <div style={{width: '100%'}} data-test='root'>
      <div className='block'>
        <span className='label'>M</span>
        <DatePicker date={date} onChange={setDate} size={Size.M} />
      </div>
      <div className='block'>
        <span className='label'>L</span>
        <DatePicker date={date} onChange={setDate} size={Size.L} />
      </div>
      <div className='block'>
        <span className='label'>FULL</span>
        <DatePicker date={date} onChange={setDate} size={Size.FULL} />
      </div>
      <div className='block'>
        <span className='label'>AUTO</span>
        <DatePicker date={date} onChange={setDate} size={Size.AUTO} />
      </div>
    </div>
  );
};

AllSizes.storyName = 'all sizes';
AllSizes.parameters = {
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

export const StartsFromSunday: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.01.18');

  return (
    <div>
      <DatePicker date={date} locale={enUS} onChange={setDate} {...args} />
    </div>
  );
};

StartsFromSunday.storyName = 'starts on Sunday';

export const SingleDateScrollMonthsTest: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.01.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} {...args} />
    </div>
  );
};

SingleDateScrollMonthsTest.storyName = 'single date (scroll months test)';

const monthsScrollerSelector = '[data-test="ring-date-popup"] [class^="months"]';

SingleDateScrollMonthsTest.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
      {type: 'waitForElementToShow', selector: monthsScrollerSelector},
      {type: 'scroll', selector: monthsScrollerSelector, x: 0, y: 1000},
      {type: 'wait', delay: 100},
      {
        type: 'capture',
        name: 'light',
        selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
      },
    ],
  },
};

export const SingleDateMonthClickTest: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.01.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} {...args} />
    </div>
  );
};

SingleDateMonthClickTest.storyName = 'single date (month click test)';

const octoberSelector = '[data-test="ring-date-popup"] [class^="monthNames"] > [class^="monthName"]:nth-child(10)';

SingleDateMonthClickTest.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
      {type: 'waitForElementToShow', selector: octoberSelector},
      {type: 'click', selector: octoberSelector},
      {type: 'wait', delay: 300},
      {
        type: 'capture',
        name: 'light',
        selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
      },
    ],
  },
};

export const SingleDateScrollYearsTest: StoryFn<DatePickerAttrs> = args => {
  const [date, setDate] = useState<Date | string | null | undefined>('01.01.18');

  return (
    <div>
      <DatePicker date={date} onChange={setDate} {...args} />
    </div>
  );
};

SingleDateScrollYearsTest.storyName = 'single date (scroll years test)';

const yearsScrollerSelector = '[data-test="ring-date-popup"] [class^="years"]';

SingleDateScrollYearsTest.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
      {type: 'waitForElementToShow', selector: yearsScrollerSelector},
      {type: 'scroll', selector: yearsScrollerSelector, x: 0, y: -80},
      {type: 'wait', delay: 300},
      {
        type: 'capture',
        name: 'light',
        selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
      },
    ],
  },
};
