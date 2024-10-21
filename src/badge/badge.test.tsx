import {render, screen} from '@testing-library/react';

import Badge from './badge';
import style from './badge.css';

describe('Badge', () => {
  it('should render span with badge class', () => {
    render(<Badge />);
    const element = screen.getByTestId('ring-badge');
    element.should.have.tagName('span');
    element.should.have.class(style.badge);
  });

  it('should use passed className', () => {
    render(<Badge className="test-class" />);
    screen.getByTestId('ring-badge').should.have.class('test-class');
  });

  it('should use passed data-test', () => {
    render(<Badge data-test="foo" />);
    screen.getByTestId('foo', {exact: false}).should.exist;
  });

  it('should render children', () => {
    render(<Badge>{'foo'}</Badge>);
    screen.getByText('foo').should.exist;
  });

  it('should render valid badge', () => {
    render(<Badge valid />);
    screen.getByTestId('ring-badge').should.have.class(style.valid);
  });
});
