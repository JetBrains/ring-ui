import {render} from '@testing-library/react';

import Text, {type TextProps} from './text';

describe('Text', () => {
  const renderText = (props?: TextProps) => render(<Text {...props} />);

  it('should create component', () => {
    const {container} = renderText();
    expect(container.querySelector('span')).to.exist;
  });

  it('should wrap children with span', () => {
    const {container} = renderText();
    const element = container.firstElementChild;
    expect(element?.tagName.toLowerCase()).to.equal('span');
  });

  it('should use passed className', () => {
    const {container} = renderText({className: 'test-class'});
    expect(container.querySelector('.test-class')).to.exist;
  });

  it('should use pass rest props to dom node', () => {
    const {container} = renderText({'data-test': 'foo'});
    expect(container.querySelector('[data-test="foo"]')).to.exist;
  });
});
