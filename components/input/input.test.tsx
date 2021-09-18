import React, {ComponentProps} from 'react';
import {shallow, mount} from 'enzyme';

import Input from './input';

describe('Input', () => {
  let input: HTMLElement | null;
  const inputRef = (el: HTMLElement | null) => {
    input = el;
  };
  const shallowInput = (props?: ComponentProps<typeof Input>) => shallow(<Input {...props}/>);
  const mountInput = (props?: ComponentProps<typeof Input>) => mount(
    <Input
      inputRef={inputRef}
      {...props}
    />
  );

  it('should create component', () => {
    mountInput().type().should.equal(Input.type);
  });

  it('should wrap children with div', () => {
    shallowInput().should.have.tagName('div');
  });

  it('should create input by default', () => {
    mountInput();
    should.exist(input);
    input?.should.match('input');
  });

  it('should create textarea with multiline option', () => {
    mountInput({multiline: true});
    should.exist(input);
    input?.should.match('textarea');
  });

  it('should use passed className', () => {
    mountInput({className: 'test-class'}).should.have.className('test-class');
  });
});
