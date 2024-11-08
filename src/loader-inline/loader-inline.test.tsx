import {render, screen} from '@testing-library/react';

import LoaderInline, {LoaderInlineAtrrs} from './loader-inline';

describe('Loader Inline', () => {
  const renderLoaderInline = (props?: LoaderInlineAtrrs) => {
    render(<LoaderInline {...props} />);
    return screen.getByTestId('ring-loader-inline');
  };

  it('should create component', () => {
    renderLoaderInline().should.exist;
  });

  it('should add custom class', () => {
    renderLoaderInline({
      className: 'test',
    }).should.have.class('test');
  });
});
