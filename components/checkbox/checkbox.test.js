/* eslint-disable func-names */

import React from 'react';

import renderIntoDocument from 'render-into-document';
import {Simulate} from 'react-dom/test-utils';
import {findDOMNode} from 'react-dom';

import Checkbox from './checkbox';

describe('Checkbox', () => {
  const renderComponent = props => renderIntoDocument(<Checkbox {...props} />);

  it('should create component', () => {
    const checkbox = renderComponent();
    checkbox.should.exist;
  });

  it('should render checkbox', () => {
    const checkbox = renderComponent();
    checkbox.input.should.have.property('type', 'checkbox');
  });

  it('should set name', () => {
    const checkbox = renderComponent({name: 'test'});

    checkbox.input.should.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = sinon.stub();

    const checkbox = renderComponent({onClick: clickHandler});
    Simulate.click(checkbox.input);

    clickHandler.should.have.been.called;
  });

  it('should not call handler on change event if disabled', () => {
    const onChange = sinon.stub();

    const checkbox = renderComponent({
      disabled: true,
      onChange
    });

    Simulate.click(findDOMNode(checkbox));
    onChange.should.have.not.been.called;
  });

  it('should be unchecked by default', () => {
    const checkbox = renderComponent();

    findDOMNode(checkbox).should.not.be.checked;
  });

  it('should check control', () => {
    const checkbox = renderComponent({defaultChecked: true});

    checkbox.input.should.be.checked;
  });

  it('should be disabled', () => {
    const checkbox = renderComponent({
      disabled: true
    });

    checkbox.input.should.be.disabled;
  });

  it('should check control on change event', () => {
    const eventMock = {
      target: {
        checked: true
      }
    };
    const checkbox = renderComponent();

    Simulate.change(checkbox.input, eventMock);
    checkbox.input.should.be.checked;
  });
});
