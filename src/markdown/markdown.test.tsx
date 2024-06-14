import {shallow} from 'enzyme';

import Markdown, {MarkdownProps} from './markdown';

describe('Markdown', () => {
  const shallowMarkdown = (props?: Partial<MarkdownProps>) => shallow(
    <Markdown
      {...props}
    >
      <div dangerouslySetInnerHTML={{__html: '<p>test</p>'}}/>
    </Markdown>
  );


  it('should wrap children with div', () => {
    shallowMarkdown().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowMarkdown({className: 'test-class'}).should.have.className('test-class');
  });
});
