import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DatePicker from './date-picker';

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
    render(<DatePicker className="test-class" />);
    expect(screen.getByTestId('ring-date-picker', {exact: false})).to.have.class('test-class');
  });

  it('should parse and display passed date', () => {
    render(<DatePicker date="01.11.16" />);
    expect(screen.getByText('1 Nov 2016')).to.exist;
  });

  it('should display a placeholder when date is invalid', () => {
    render(<DatePicker datePlaceholder="set date pls" date="hbkj" />);
    expect(screen.getByText('set date pls')).to.exist;
  });

  it('should display a placeholder when date is unspecified', () => {
    render(<DatePicker datePlaceholder="set date pls" />);
    expect(screen.getByText('set date pls')).to.exist;
  });

  it('should parse and display passed date and time', () => {
    render(<DatePicker date="01.11.16, 09:45" withTime />);
    expect(screen.getByText('1 Nov 2016, 09:45')).to.exist;
  });

  it('should display a placeholder when date is invalid (in case of withTime=true)', () => {
    render(<DatePicker dateTimePlaceholder="set date & time" withTime date="hbkj" />);
    expect(screen.getByText('set date & time')).to.exist;
  });

  it('should display a placeholder when date is unspecified (in case of withTime=true)', () => {
    render(<DatePicker dateTimePlaceholder="set date & time" withTime />);
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
        <button data-test="btn-today" type="button">
          {'Today'}
        </button>
      );
    }

    render(<DatePicker renderAfterCalendar={customComponent} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('btn-today')).to.have.text('Today');
  });
});
