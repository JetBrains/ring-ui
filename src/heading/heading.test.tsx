import {render, screen} from '@testing-library/react';

import Heading, {H2, type HeadingProps} from './heading';

describe('Heading', () => {
  const renderHeading = (props?: HeadingProps) => render(<Heading {...props} />);

  it('should wrap children with h1 by default', () => {
    renderHeading();
    expect(screen.getByRole('heading')).to.have.tagName('h1');
  });

  it('should accept level prop', () => {
    renderHeading({level: Heading.Levels.H3});
    expect(screen.getByRole('heading')).to.have.tagName('h3');
  });

  it('should export helpers', () => {
    render(<H2 />);
    expect(screen.getByRole('heading')).to.have.tagName('h2');
  });

  it('should use passed className', () => {
    renderHeading({className: 'test-class'});
    expect(screen.getByRole('heading')).to.have.class('test-class');
  });
});
