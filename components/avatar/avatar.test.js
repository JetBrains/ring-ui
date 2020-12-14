import React from 'react';
import {shallow, mount} from 'enzyme';

import {getPixelRatio} from '../global/dom';

import Avatar from './avatar';

const dataURI = `data:image/svg+xml,${encodeURIComponent(`
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#00cc00"/>
  </svg>`
)}`;

describe('Avatar', () => {
  const shallowAvatar = props => shallow(<Avatar {...props}/>);
  const mountAvatar = props => mount(<Avatar {...props}/>);

  it('should create component', () => {
    mountAvatar().should.have.type(Avatar);
  });

  it('should use passed className', () => {
    shallowAvatar({className: 'test-class'}).should.have.className('test-class');
  });

  it('should use passed className when url is passed', () => {
    shallowAvatar({className: 'test-class', url: dataURI}).should.
      have.className('test-class');
  });

  it('should render span when no url is passed', () => {
    shallowAvatar().should.have.tagName('span');
  });

  it('should render image when url is passed', () => {
    shallowAvatar({url: dataURI}).should.match('img[src]');
  });

  it('should not append params when data:uri is passed', () => {
    shallowAvatar({url: dataURI}).should.have.prop('src').
      not.match(/dpr=|size=/);
  });

  it('should append params when data:uri is passed', () => {
    shallowAvatar({url: 'http://'}).should.have.prop('src').match(/dpr=|size=/);
  });

  it('should set size 20 as default', () => {
    shallowAvatar({url: 'http://'}).should.have.prop('src').match(/size=20/);
  });

  it('should set proper dpr', () => {
    shallowAvatar({url: 'http://'}).should.have.prop('src').
      match(new RegExp(`dpr=${getPixelRatio()}`));
  });
});
