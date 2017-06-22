import React from 'react';
import {shallow, mount} from 'enzyme';

import Input from './input';

describe('Input', () => {
  const shallowInput = params => shallow(<Input {...params}/>);
  const mountInput = params => mount(<Input {...params}/>);

  it('should create component', () => {
    mountInput().should.have.type(Input);
  });

  it('should create input by default', () => {
    shallowInput().should.have.tagName('input');
  });

  it('should create textarea with multiline option', () => {
    shallowInput({multiline: true}).should.have.tagName('textarea');
  });

  it('should use passed className', () => {
    shallowInput({className: 'test-class'}).should.have.className('test-class');
  });
});
