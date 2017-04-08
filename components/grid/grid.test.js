import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';
import styles from './grid.css';

import {Col, Grid, Row} from './grid';

describe('Grid', () => {
  const renderComponent = props => renderIntoDocument(<Grid {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Grid).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });
});

describe('Row', () => {
  const renderComponent = props => renderIntoDocument(<Row {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Row).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should convert "center" modificator to appropriate className', () => {
    findDOMNode(renderComponent({center: 'md'})).should.match(`.${styles['center-md']}`);
  });

  it('should convert "reverse" modificator to appropriate className', () => {
    findDOMNode(renderComponent({reverse: true})).should.match(`.${styles.reverse}`);
  });
});

describe('Col', () => {
  const renderComponent = props => renderIntoDocument(<Col {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Col).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should convert digital value to appropriate className', () => {
    findDOMNode(renderComponent({xs: 2})).should.match(`.${styles['col-xs-2']}`);
  });

  it('should convert autosize to appropriate className', () => {
    findDOMNode(renderComponent({xs: true})).should.match(`.${styles['col-xs']}`);
  });
});
