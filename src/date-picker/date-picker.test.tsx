import {mount, shallow, render} from 'enzyme';

import {I18nContextHolder} from '../i18n/i18n-context';

import DatePicker, {DatePickerAttrs} from './date-picker';
import styles from './date-picker.css';

describe('Date Picker', () => {
  const shallowDatePicker = (params?: DatePickerAttrs) => shallow(
    <I18nContextHolder messages={{}}>
      <DatePicker {...params}/>
    </I18nContextHolder>
  );
  const mountDatePicker = (params?: DatePickerAttrs) => mount(<DatePicker {...params}/>);
  const renderDatePicker = (params?: DatePickerAttrs) => render(<DatePicker {...params}/>);

  it('should create component', () => {
    mountDatePicker().should.have.type(DatePicker);
  });

  it('should render a div', () => {
    shallowDatePicker().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowDatePicker({className: 'test-class'}).find(DatePicker).should.have.className('test-class');
  });

  it('should parse and display passed date', () => {
    renderDatePicker({date: '01.11.16'}).should.have.text('1 Nov 2016');
  });

  it('should display a placeholder when date unspecified or invalid',
    () => {
      renderDatePicker({
        datePlaceholder: 'set date pls',
        date: 'hbkj'
      }).should.have.text('set date pls');
      renderDatePicker({datePlaceholder: 'set date pls'}).should.have.text('set date pls');
    }
  );

  it('should parse and display passed date and time', () => {
    renderDatePicker({
      withTime: true,
      date: '01.11.16, 09:45'
    }).should.have.text('1 Nov 2016, 09:45');
  });

  it('should display a placeholder when date unspecified or invalid (in case of withTime=true)',
    () => {
      renderDatePicker({
        dateTimePlaceholder: 'set date & time',
        withTime: true,
        date: 'hbkj'
      }).should.have.text('set date & time');
      renderDatePicker({
        dateTimePlaceholder: 'set date & time',
        withTime: true,
        date: ''
      }).should.have.text('set date & time');
    }
  );

  it('should accept a Date instance', () => {
    renderDatePicker({date: new Date(0)}).should.have.text('1 Jan 1970');
  });

  it('should render a popup on button click', () => {
    const picker = mountDatePicker();
    picker.simulate('click');
    document.body.should.contain(`.${styles.datePopup}`);
  });

  it('should display in the popup the component passed through its render prop', () => {
    function customComponent() {
      return (
        <button
          className="btn-today"
          type="button"
        >
          {'Today'}
        </button>
      );
    }

    const picker = mountDatePicker({
      renderAfterCalendar: customComponent
    });
    picker.simulate('click');

    const today = document.body.querySelector('.btn-today');
    should.exist(today);
    today?.should.have.text('Today');
  });
});
