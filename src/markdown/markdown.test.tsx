import {render, screen} from '@testing-library/react';

import Markdown, {MarkdownProps} from './markdown';

describe('Markdown', () => {
  const renderMarkdown = (props?: Partial<MarkdownProps>) => {
    render(
      <Markdown {...props}>
        <div dangerouslySetInnerHTML={{__html: '<p>test</p>'}} />
      </Markdown>,
    );
    return screen.getByTestId('ring-markdown');
  };

  it('should wrap children with div', () => {
    renderMarkdown().should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderMarkdown({className: 'test-class'}).should.have.class('test-class');
  });
});
