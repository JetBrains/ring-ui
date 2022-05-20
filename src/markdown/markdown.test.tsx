/* eslint-disable react/no-children-prop */
import React from 'react';
import {shallow, mount} from 'enzyme';

import Code from '../code/code';
import Link from '../link/link';

import Markdown, {MarkdownProps} from './markdown';

describe('Markdown', () => {
  const shallowMarkdown = (props?: Partial<MarkdownProps>) => shallow(
    <Markdown
      children=""
      {...props}
    />
  );
  const mountMarkdown = (props?: Partial<MarkdownProps>) => mount(
    <Markdown
      children=""
      {...props}
    />
  );

  it('should wrap children with div', () => {
    shallowMarkdown().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowMarkdown({className: 'test-class'}).should.have.className('test-class');
  });

  it('should convert links to ring Links', () => {
    const wrapper = mountMarkdown({children: '[link](/)'});
    wrapper.should.have.descendants(Link);
  });

  it('should convert inline code to ring Code', () => {
    const wrapper = mountMarkdown({children: '`some(code)`'});
    wrapper.should.have.descendants(Code);
  });

  it('should convert block code to ring Code', () => {
    const wrapper = mountMarkdown({
      children: `
        \`\`\`
        some(code)
        \`\`\`
      `
    });
    wrapper.should.have.descendants(Code);
  });

  it('should convert not finished code block to empty ring Code', () => {
    const wrapper = mountMarkdown({
      children: `
        \`\`\`
      `
    });
    wrapper.should.have.descendants(Code);
  });
});
