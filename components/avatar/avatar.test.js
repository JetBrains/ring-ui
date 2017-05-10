import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import {getPixelRatio} from '../global/dom';

import Avatar from './avatar';

const dataURI = `data:image/svg+xml,${encodeURIComponent(`
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#00cc00"/>
  </svg>`
)}`;

describe('Avatar', () => {
  const renderComponent = props => renderIntoDocument(<Avatar {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Avatar).should.be.true;
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should use passed className when url is passed', () => {
    findDOMNode(renderComponent({className: 'test-class', url: dataURI})).should.
      match('.test-class');
  });

  it('should render span when no url is passed', () => {
    findDOMNode(renderComponent()).should.match('span');
  });

  it('should render image when url is passed', () => {
    findDOMNode(renderComponent({url: dataURI})).should.match('img[src]');
  });

  it('should not append params when data:uri is passed', () => {
    findDOMNode(renderComponent({url: dataURI})).should.have.attribute('src').
      not.match(/dpr=|size=/);
  });

  it('should append params when data:uri is passed', () => {
    findDOMNode(renderComponent({url: 'http://'})).should.have.attribute('src').match(/dpr=|size=/);
  });

  it('should set size 20 as default', () => {
    findDOMNode(renderComponent({url: 'http://'})).should.have.attribute('src').match(/size=20/);
  });

  it('should set proper dpr', () => {
    findDOMNode(renderComponent({url: 'http://'})).should.have.attribute('src').
      match(new RegExp(`dpr=${getPixelRatio()}`));
  });
});
