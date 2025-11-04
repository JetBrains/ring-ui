import {render, screen} from '@testing-library/react';

import Markdown, {type MarkdownProps} from './markdown';

import styles from './markdown.css';

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

  it('should apply inline class when inline prop is true', () => {
    expect(renderMarkdown({inline: true})).to.have.class(styles.inline);
  });

  it('should apply markdown class when inline is false or not provided', () => {
    expect(renderMarkdown({inline: false})).to.have.class(styles.markdown);
    expect(renderMarkdown()).to.have.class(styles.markdown);
  });

  it('should render children correctly', () => {
    render(
      <Markdown>
        <span data-test='test-child'>{'Test content'}</span>
      </Markdown>,
    );
    expect(screen.getByTestId('test-child')).to.exist;
  });
});
