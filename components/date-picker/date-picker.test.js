import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType, Simulate} from 'react-addons-test-utils';

import DatePicker from './date-picker';

import styles from './date-picker.css';

describe('Date Picker', () => {
  const renderComponent = props => renderIntoDocument(<DatePicker {...props}/>);
  const renderNode = props => findDOMNode(renderComponent(props));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), DatePicker).should.be.true;
  });

  it('should render a button', () => {
    renderNode().firstChild.should.match(`button.${styles.datePicker}`);
  });

  it('should use passed className', () => {
    renderNode({className: 'test-class'}).firstChild.should.match('.test-class');
  });

  it('should parse and display passed date', () => {
    renderNode({date: '01.11.16'}).should.have.text('1 Nov 2016');
  });

  it('should accept a Date instance', () => {
    renderNode({date: new Date(0)}).should.have.text('1 Jan 1970');
  });

  it('should render a popup on button click', () => {
    const picker = renderNode();
    Simulate.click(picker);
    document.body.should.contain(`.${styles.datePopup}`);
  });

  // TODO Add more tests
});
