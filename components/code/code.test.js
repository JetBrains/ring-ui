import 'dom4';
import React from 'react';
import {render, findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';

import Code, {code} from './code';

describe('Code', () => {
  const renderComponent = props => renderIntoDocument(
    <Code
      code=""
      {...props}
    />
  );

  it('should wrap children with pre', () => {
    findDOMNode(renderComponent()).should.match('pre');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should add passed language to class attribute', () => {
    findDOMNode(renderComponent({language: 'js'})).should.match('.js');
  });

  it('should detect javascript/JSX', () => {
    const node = findDOMNode(renderComponent({
      code: `
        import React, {Component} from 'react';
        import ChildComponent from './child-component';
        
        const MyComponent = () => (
          <div className="class">
            <ChildComponent prop="value" />
          </div>
        );
      `
    }));
    node.should.contain('.javascript');
    node.should.contain('.xml');
  });

  it('should detect CSS', () => {
    const node = findDOMNode(renderComponent({
      code: `
        .className {
          display: inline-block;
          font-size: 18px;
        }
      `
    }));
    node.should.contain('.css');
  });

  it('should detect HTML', () => {
    const node = findDOMNode(renderComponent({
      code: `
        <body>
          <div id="app"></div>
        </body>
      `
    }));
    node.should.contain('.xml');
  });

  it('should parse and highlight the code', () => {
    const node = findDOMNode(renderComponent({
      code: '"foo"'
    }));
    const token = node.query('.hljs-string');
    token.should.have.text('"foo"');
  });

  it('should parse and highlight the code after props update', () => {
    const container = document.createElement('div');
    render(code`"foo"`, container);
    const node = findDOMNode(
      render(code`"bar"`, container)
    );
    const token = node.query('.hljs-string');
    token.should.have.text('"bar"');
  });
});
