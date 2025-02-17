import {render} from '@testing-library/react';

import Text, {TextProps} from './text';

describe('Text', () => {
  const renderText = (props?: TextProps) => render(<Text {...props} />);

  it('should create component', () => {
    const {container} = renderText();
    container.querySelector('span')?.should.exist;
  });

  it('should wrap children with span', () => {
    const {container} = renderText();
    const element = container.firstElementChild;
    element?.tagName.toLowerCase().should.equal('span');
  });

  it('should use passed className', () => {
    const {container} = renderText({className: 'test-class'});
    container.querySelector('.test-class')?.should.exist;
  });

  it('should use pass rest props to dom node', () => {
    const {container} = renderText({'data-test': 'foo'});
    container.querySelector('[data-test="foo"]')?.should.exist;
  });
});
