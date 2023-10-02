import React from 'react';
import {shallow} from 'enzyme';

import Markdown, {MarkdownProps} from './markdown';

describe('Markdown', () => {
  const shallowMarkdown = (props?: Partial<MarkdownProps>) => shallow(
    <Markdown
      content="<p>test</p>"
      {...props}
    />
  );


  it('should wrap children with div', () => {
    shallowMarkdown().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowMarkdown({className: 'test-class'}).should.have.className('test-class');
  });
});
