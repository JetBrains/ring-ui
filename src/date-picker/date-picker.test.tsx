import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useState} from 'react';

import DatePicker from './date-picker';
import {getDefaultScrollDate} from './consts';

describe('Date Picker', () => {
  it('should create component', () => {
    render(<DatePicker />);
    expect(screen.getByTestId('ring-date-picker', {exact: false})).to.exist;
  });

  it('should render a div', () => {
    render(<DatePicker />);
    expect(screen.getByTestId('ring-date-picker', {exact: false})).to.have.tagName('div');
  });

  it('should use passed className', () => {
    render(<DatePicker className='test-class' />);
    expect(screen.getByTestId('ring-date-picker', {exact: false})).to.have.class('test-class');
  });

  it('should parse and display passed date', () => {
    render(<DatePicker date='01.11.16' />);
    expect(screen.getByText('1 Nov 2016')).to.exist;
  });

  it('should display a placeholder when date is invalid', () => {
    render(<DatePicker datePlaceholder='set date pls' date='hbkj' />);
    expect(screen.getByText('set date pls')).to.exist;
  });

  it('should display a placeholder when date is unspecified', () => {
    render(<DatePicker datePlaceholder='set date pls' />);
    expect(screen.getByText('set date pls')).to.exist;
  });

  it('should parse and display passed date and time', () => {
    render(<DatePicker date='01.11.16, 09:45' withTime />);
    expect(screen.getByText('1 Nov 2016, 09:45')).to.exist;
  });

  it('should display a placeholder when date is invalid (in case of withTime=true)', () => {
    render(<DatePicker dateTimePlaceholder='set date & time' withTime date='hbkj' />);
    expect(screen.getByText('set date & time')).to.exist;
  });

  it('should display a placeholder when date is unspecified (in case of withTime=true)', () => {
    render(<DatePicker dateTimePlaceholder='set date & time' withTime />);
    expect(screen.getByText('set date & time')).to.exist;
  });

  it('should accept a Date instance', () => {
    render(<DatePicker date={new Date(0)} />);
    expect(screen.getByText('1 Jan 1970')).to.exist;
  });

  it('should render a popup on button click', async () => {
    render(<DatePicker />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('ring-date-popup')).to.exist;
  });

  it('should display in the popup the component passed through its render prop', async () => {
    function customComponent() {
      return (
        <button data-test='btn-today' type='button'>
          {'Today'}
        </button>
      );
    }

    render(<DatePicker renderAfterCalendar={customComponent} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('btn-today')).to.have.text('Today');
  });

  const parseDateInput = (input: Date | number | string | null | undefined) => {
    if (input == null) return null;
    if (input instanceof Date) return input;
    if (typeof input === 'number') return new Date(input);

    const m = /^(\d\d)\.(\d\d)\.(\d\d\d\d)$/.exec(input);
    if (!m) return null;

    const [, dd, mm, yyyy] = m;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  };

  test('defaultScrollDate unbounded', () => {
    const scrollDate = getDefaultScrollDate({
      parseDateInput,
    });
    expectNearNow(scrollDate);
  });

  test('defaultScrollDate -- minDate is in the past', () => {
    const scrollDate = getDefaultScrollDate({
      minDate: '01.01.2000',
      parseDateInput,
    });
    expectNearNow(scrollDate);
  });

  test('defaultScrollDate -- minDate is in the future', () => {
    const scrollDate = getDefaultScrollDate({
      minDate: '01.01.3000',
      parseDateInput,
    });
    expect(scrollDate.getTime()).toBe(Number(new Date(3000, 0, 1)));
  });

  test('defaultScrollDate -- maxDate is in the past', () => {
    const scrollDate = getDefaultScrollDate({
      maxDate: '01.01.2000',
      parseDateInput,
    });
    expect(scrollDate.getTime()).toBe(Number(new Date(2000, 0, 1)));
  });

  test('defaultScrollDate -- maxDate is in the future', () => {
    const scrollDate = getDefaultScrollDate({
      maxDate: '01.01.3000',
      parseDateInput,
    });
    expectNearNow(scrollDate);
  });

  test('defaultScrollDate -- minDate..maxDate contains now', () => {
    const scrollDate = getDefaultScrollDate({
      minDate: '01.01.2000',
      maxDate: '01.01.3000',
      parseDateInput,
    });
    expectNearNow(scrollDate);
  });

  test('defaultScrollDate -- minDate..maxDate is in the past', () => {
    const scrollDate = getDefaultScrollDate({
      minDate: '01.01.2000',
      maxDate: '01.01.2010',
      parseDateInput,
    });
    expect(scrollDate.getTime()).toBe(Number(new Date(2000, 0, 1)));
  });

  test('defaultScrollDate -- minDate..maxDate is in the future', () => {
    const scrollDate = getDefaultScrollDate({
      minDate: '01.01.3000',
      maxDate: '01.01.3010',
      parseDateInput,
    });
    expect(scrollDate.getTime()).toBe(Number(new Date(3000, 0, 1)));
  });

  function expectNearNow(scrollDate: Date) {
    const now = new Date();
    const msg = `scrollDate: ${scrollDate.toISOString()}, now: ${now.toISOString()}`;
    expect(Number(scrollDate), msg).toBeCloseTo(
      Number(now),
      -3, // 3 significant digits, i.e. 1 second
    );
  }

  it('should not crash on parsing to Date(NaN)', () => {
    render(<DatePicker parseDateInput={() => new Date(NaN)} />);
  });

  it('should not crash on Date(NaN) date', () => {
    render(<DatePicker date={new Date(NaN)} />);
  });

  it('should not crash on Number.NaN date', () => {
    render(<DatePicker date={NaN} />);
  });

  it('should not crash on Infinity date', () => {
    render(<DatePicker date={Infinity} />);
  });

  it('should not crash on time without date but ignore it', async () => {
    function WithTime() {
      const [date, setDate] = useState<Date | null>(null);
      function handleChange(newDate: Date | null | undefined) {
        if (newDate) setDate(newDate ?? null);
      }
      return <DatePicker date={date} onChange={handleChange} withTime />;
    }

    render(<WithTime />);

    const activatePopupButton = screen.getByRole('button');
    await userEvent.click(activatePopupButton);
    const [addTimeInput] = screen.getAllByLabelText('Add time');
    await userEvent.type(addTimeInput, '10:20{Enter}');
    expect(activatePopupButton.textContent).toBe('Set date and time');
  });
});
