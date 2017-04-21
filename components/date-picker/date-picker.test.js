import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  isCompositeComponentWithType,
  renderIntoDocument,
  Simulate
} from 'react-dom/test-utils';

import sniffer from '../global/sniffer';

import DatePicker from './date-picker';
import styles from './date-picker.css';

describe('Date Picker', () => {
  const renderComponent = props => renderIntoDocument(<DatePicker {...props}/>);
  const renderNode = props => findDOMNode(renderComponent(props));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), DatePicker).should.be.true;
  });

  it('should render a div', () => {
    renderNode().should.match('div');
  });

  it('should use passed className', () => {
    renderNode({className: 'test-class'}).should.match('.test-class');
  });

  it('should parse and display passed date', () => {
    if (sniffer.browser.name === 'edge') {
      return;
    }

    renderNode({date: '01.11.16'}).should.have.text('1 Nov 2016');
  });

  it('should accept a Date instance', () => {
    if (sniffer.browser.name === 'edge') {
      return;
    }

    renderNode({date: new Date(0)}).should.have.text('1 Jan 1970');
  });

  it('should render a popup on button click', () => {
    const picker = renderNode();
    Simulate.click(picker);
    document.body.should.contain(`.${styles.datePopup}`);
  });

  // TODO Add more tests
});
