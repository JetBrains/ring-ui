import {render, screen} from '@testing-library/react';

import Heading, {H2, HeadingProps} from './heading';

describe('Heading', () => {
  const renderHeading = (props?: HeadingProps) => render(<Heading {...props} />);

  it('should wrap children with h1 by default', () => {
    renderHeading();
    screen.getByRole('heading').should.have.tagName('h1');
  });

  it('should accept level prop', () => {
    renderHeading({level: Heading.Levels.H3});
    screen.getByRole('heading').should.have.tagName('h3');
  });

  it('should export helpers', () => {
    render(<H2 />);
    screen.getByRole('heading').should.have.tagName('h2');
  });

  it('should use passed className', () => {
    renderHeading({className: 'test-class'});
    screen.getByRole('heading').should.have.class('test-class');
  });
});
