import React from 'react';
import {shallow, mount} from 'enzyme';

import Input from './input';

describe('Input', () => {
  let input;
  const inputRef = el => {
    input = el;
  };
  const shallowInput = props => shallow(<Input {...props}/>);
  const mountInput = props => mount(
    <Input
      inputRef={inputRef}
      {...props}
    />
  );

  it('should create component', () => {
    mountInput().should.have.type(Input);
  });

  it('should wrap children with div', () => {
    shallowInput().should.have.tagName('div');
  });

  it('should create input by default', () => {
    mountInput();
    input.should.match('input');
  });

  it('should create textarea with multiline option', () => {
    mountInput({multiline: true});
    input.should.match('textarea');
  });

  it('should use passed className', () => {
    shallowInput({className: 'test-class'}).should.have.className('test-class');
  });
});
