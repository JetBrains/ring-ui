import React from 'react';
import {shallow, mount} from 'enzyme';

import ContentEditable from './contenteditable';

describe('ContentEditable', () => {
  const stub = sandbox.stub();

  afterEach(() => stub.reset());

  const defaultProps = {
    className: 'test',
    onComponentUpdate: stub
  };

  const mountContentEditable = (props = defaultProps) => mount(
    <ContentEditable {...props}>
      <b>{'bold'}</b>
    </ContentEditable>
  );
  const shallowContentEditable = (props = defaultProps) => shallow(
    <ContentEditable {...props}>
      <b>{'bold'}</b>
    </ContentEditable>
  );

  it('should create component', () => {
    mountContentEditable().should.have.type(ContentEditable);
  });

  it('should pass other properties', () => {
    shallowContentEditable().should.have.className('test');
  });


  it('should dangerously set html', () => {
    mountContentEditable().getDOMNode().innerHTML.should.equal('<b>bold</b>');
  });

  it('should render only on html / disabled change', () => {
    const wrapper = mountContentEditable();
    wrapper.setProps({
      disabled: true
    });

    wrapper.setProps({
      children: <span/>
    });

    stub.should.have.been.calledThrice;
  });

  it('should not render on other props change', () => {
    const wrapper = mountContentEditable();
    wrapper.setProps({
      className: 'testtest'
    });

    stub.should.have.been.calledOnce;
  });

  it('should set tabindex equal zero by default', () => {
    shallowContentEditable().should.have.attr('tabindex', '0');
  });

  it('should allow pass custom tabindex', () => {
    const wrapper = shallowContentEditable({
      tabIndex: -1
    });

    wrapper.should.have.attr('tabindex', '-1');
  });
});
