import {render, screen} from '@testing-library/react';

import Header, {type HeaderAttrs} from './header';

describe('Header', () => {
  const getHeaderDiv = (props?: HeaderAttrs) => {
    render(<Header {...props} />);
    return screen.getByRole('banner');
  };

  it('should wrap children with header', () => {
    expect(getHeaderDiv()).to.exist;
  });

  it('should use passed className', () => {
    expect(getHeaderDiv({className: 'test-class'})).to.have.class('test-class');
  });
});
