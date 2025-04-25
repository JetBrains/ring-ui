import {render, screen} from '@testing-library/react';

import LoaderInline, {LoaderInlineAtrrs} from './loader-inline';

describe('Loader Inline', () => {
  const renderLoaderInline = (props?: LoaderInlineAtrrs) => {
    render(<LoaderInline {...props} />);
    return screen.getByTestId('ring-loader-inline');
  };

  it('should create component', () => {
    expect(renderLoaderInline()).to.exist;
  });

  it('should add custom class', () => {
    expect(
      renderLoaderInline({
        className: 'test',
      }),
    ).to.have.class('test');
  });
});
