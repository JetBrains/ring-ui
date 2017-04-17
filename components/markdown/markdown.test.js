import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Code from '../code/code';
import Link from '../link/link';

import Markdown from './markdown';

describe('Markdown', () => {
  const renderComponent = props => renderIntoDocument(
    <Markdown
      source=""
      {...props}
    />
  );

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should convert links to ring Links', () => {
    const component = renderComponent({source: '[link](/)'});
    findRenderedComponentWithType(component, Link).should.exist;
  });

  it('should convert inline code to ring Code', () => {
    const component = renderComponent({source: '`some(code)`'});
    findRenderedComponentWithType(component, Code).should.exist;
  });

  it('should convert block code to ring Code', () => {
    const component = renderComponent({
      source: `
        \`\`\`
        some(code)
        \`\`\`
      `
    });
    findRenderedComponentWithType(component, Code).should.exist;
  });
});
