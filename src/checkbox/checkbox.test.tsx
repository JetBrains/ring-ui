import React from 'react';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import Checkbox, {CheckboxProps} from './checkbox';

type CheckboxAttributes = JSX.LibraryManagedAttributes<typeof Checkbox, CheckboxProps>

describe('Checkbox', () => {
  const shallowCheckbox = (props?: CheckboxAttributes) => shallow(<Checkbox {...props}/>);
  const mountCheckbox = (props?: CheckboxAttributes) => mount<Checkbox>(<Checkbox {...props}/>);

  it('should create component', () => {
    shallowCheckbox().should.exist;
  });

  it('should render checkbox', () => {
    const checkbox = mountCheckbox().instance();
    should.exist(checkbox.input);
    checkbox.input?.should.have.property('type', 'checkbox');
  });

  it('should set name', () => {
    const checkbox = mountCheckbox({name: 'test'}).instance();

    should.exist(checkbox.input);
    checkbox.input?.should.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = sandbox.stub();

    const checkbox = mountCheckbox({onClick: clickHandler}).instance();
    checkbox.input && Simulate.click(checkbox.input);

    clickHandler.should.have.been.called;
  });

  it('should not call handler on change event if disabled', () => {
    const onChange = sandbox.stub();

    const checkbox = shallowCheckbox({
      disabled: true,
      onChange
    });

    checkbox.simulate('click');
    onChange.should.have.not.been.called;
  });

  it('should be unchecked by default', () => {
    const checkbox = shallowCheckbox();

    checkbox.should.not.be.checked();
  });

  it('should check control', () => {
    const checkbox = mountCheckbox({defaultChecked: true}).instance();

    should.exist(checkbox.input);
    checkbox.input?.should.be.checked;
  });

  it('should be disabled', () => {
    const checkbox = mountCheckbox({
      disabled: true
    }).instance();

    should.exist(checkbox.input);
    checkbox.input?.should.be.disabled;
  });

  it('should check control on change event', () => {
    const eventMock = {
      target: {
        checked: true
      } as HTMLInputElement
    };
    const checkbox = mountCheckbox().instance();

    should.exist(checkbox.input);
    checkbox.input && Simulate.change(checkbox.input, eventMock);
    checkbox.input?.should.be.checked;
  });
});
