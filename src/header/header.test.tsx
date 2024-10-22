import {render, screen} from '@testing-library/react';

import Header, {HeaderAttrs} from './header';

describe('Header', () => {
  const getHeaderDiv = (props?: HeaderAttrs) => {
    render(<Header {...props} />);
    return screen.getByRole('banner');
  };

  it('should wrap children with header', () => {
    getHeaderDiv().should.exist;
  });

  it('should use passed className', () => {
    getHeaderDiv({className: 'test-class'}).should.have.class('test-class');
  });
});
