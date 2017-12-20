import 'dom4';
import React from 'react';
import {shallow, mount} from 'enzyme';

import Code from './code';

describe('Code', () => {
  const shallowCode = props => shallow(
    <Code
      code=""
      {...props}
    />,
    {disableLifecycleMethods: true}
  );
  const mountCode = props => mount(
    <Code
      code=""
      {...props}
    />
  );

  it('should wrap children with pre', () => {
    shallowCode().should.have.tagName('pre');
  });

  it('should use passed className', () => {
    shallowCode({className: 'test-class'}).should.have.className('test-class');
  });

  it('should add passed language to class attribute', () => {
    shallowCode({language: 'js'}).should.have.className('js');
  });

  it('should detect javascript/JSX', () => {
    const wrapper = mountCode({
      code: `
        import React, {Component} from 'react';
        import ChildComponent from './child-component';
        
        const MyComponent = () => (
          <div className="class">
            <ChildComponent prop="value" />
          </div>
        );
      `
    });

    // child tree is rendered with highlight.js, so it's unaccessible by enzyme
    wrapper.getDOMNode().should.contain('.javascript');
    wrapper.getDOMNode().should.contain('.xml');
  });

  it('should detect CSS', () => {
    const wrapper = mountCode({
      code: `
        .className {
          display: inline-block;
          font-size: 18px;
        }
      `
    });
    wrapper.getDOMNode().should.contain('.css');
  });

  it('should detect HTML', () => {
    const wrapper = mountCode({
      code: `
        <body>
          <div id="app"></div>
        </body>
      `
    });
    wrapper.getDOMNode().should.contain('.xml');
  });

  it('should parse and highlight the code', () => {
    const wrapper = mountCode({
      code: '"foo"'
    });
    const token = wrapper.getDOMNode().query('.hljs-string');
    token.textContent.should.equal('"foo"');
  });

  it('should parse and highlight the code after props update', () => {
    const wrapper = mountCode({
      code: '"foo"'
    });
    wrapper.setProps({
      code: '"bar"'
    });
    const token = wrapper.getDOMNode().query('.hljs-string');
    token.textContent.should.equal('"bar"');
  });
});
