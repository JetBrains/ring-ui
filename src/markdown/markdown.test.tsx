import {render, screen} from '@testing-library/react';

import Markdown, {type MarkdownProps} from './markdown';

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
    expect(renderMarkdown()).to.have.tagName('div');
  });

  it('should use passed className', () => {
    expect(renderMarkdown({className: 'test-class'})).to.have.class('test-class');
  });
});
