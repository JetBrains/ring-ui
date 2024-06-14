import {InputHTMLAttributes} from 'react';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import {RadioItemInner} from './radio__item';

describe('Radio Item', () => {
  function noop() {}

  const factory = (props?: InputHTMLAttributes<HTMLInputElement>) => (
    <RadioItemInner
      checked={false}
      onChange={noop}
      value="test"
      {...props}
    >
      {'test'}
    </RadioItemInner>
  );
  const mountRadioItem = (props?: InputHTMLAttributes<HTMLInputElement>) =>
    mount<RadioItemInner>(factory(props));
  const shallowRadioItem = (props?: InputHTMLAttributes<HTMLInputElement>) =>
    shallow(factory(props));

  it('should create component', () => {
    shallowRadioItem().should.exist;
  });

  it('should render radio item', () => {
    mountRadioItem().instance().input!.should.have.property('type', 'radio');
  });

  it('should generate id if not passed', () => {
    mountRadioItem().instance().input!.should.have.property('id');
  });

  it('should generate unique id', () => {
    const firstRadioItem = mountRadioItem();
    const secondRadioItem = mountRadioItem();
    const secondRadioId = secondRadioItem.instance().input!.getAttribute('id') ?? '';
    firstRadioItem.instance().input!.should.not.have.id(secondRadioId);
  });

  it('should set custom id', () => {
    const radioItem = mountRadioItem({
      id: 'test'
    });

    radioItem.instance().input!.should.have.id('test');
  });

  it('should set name', () => {
    const radioItem = mountRadioItem({
      name: 'test'
    });

    radioItem.instance().input!.should.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = sandbox.stub();
    const radioItem = mountRadioItem({
      onClick: clickHandler
    });

    Simulate.click(radioItem.instance().input!);
    clickHandler.should.have.been.called;
  });

  it('should be unchecked by default', () => {
    const radioItem = mountRadioItem();

    radioItem.instance().input!.should.not.have.property('checked', true);
  });

  it('should check control', () => {
    const radioItem = mountRadioItem({
      checked: true,
      onChange: () => {} // avoid "checked without onChange" warning
    });

    radioItem.instance().input!.should.have.property('checked', true);
  });

  it('should be disabled', () => {
    const radioItem = mountRadioItem({
      disabled: true
    });

    radioItem.instance().input!.should.be.disabled;
  });


  it('should connect labels with input by id', () => {
    const radioItem = mountRadioItem();
    const id = radioItem.instance().input!.getAttribute('id') ?? '';

    radioItem.instance().label!.should.have.attribute('for', id);
  });
});
