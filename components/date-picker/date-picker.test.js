import React from 'react';
import {mount, shallow, render} from 'enzyme';

import DatePicker from './date-picker';
import styles from './date-picker.css';

describe('Date Picker', () => {
  const shallowDatePicker = params => shallow(<DatePicker {...params}/>);
  const mountDatePicker = params => mount(<DatePicker {...params}/>);
  const renderDatePicker = params => render(<DatePicker {...params}/>);

  it('should create component', () => {
    mountDatePicker().should.have.type(DatePicker);
  });

  it('should render a div', () => {
    shallowDatePicker().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowDatePicker({className: 'test-class'}).should.have.className('test-class');
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
      date: '01.11.16',
      time: '9:45'
    }).should.have.text('1 Nov 2016, 09:45');
  });

  it('should display a placeholder when time and date unspecified or invalid (in case of withTime=true)',
    () => {
      renderDatePicker({
        dateTimePlaceholder: 'set date & time',
        withTime: true,
        date: 'hbkj',
        time: ''
      }).should.have.text('set date & time');
      renderDatePicker({
        dateTimePlaceholder: 'set date & time',
        withTime: true,
        date: '',
        time: 'fgsd'
      }).should.have.text('set date & time');
    }
  );

  it('should display a "—" when either time or date unspecified or invalid (withTime=true usecase)',
    () => {
      renderDatePicker({withTime: true, date: 'hbkj', time: '9:34'}).should.have.text('—, 09:34');
      renderDatePicker({withTime: true, time: '9:34'}).should.have.text('—, 09:34');
      renderDatePicker({withTime: true, date: '12.01.2013', time: 'hdfgn'}).should.have.text('12 Jan 2013, —');
      renderDatePicker({withTime: true, date: '12.01.2013'}).should.have.text('12 Jan 2013, —');
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
});
