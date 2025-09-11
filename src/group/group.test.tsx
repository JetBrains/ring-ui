import {type HTMLAttributes} from 'react';
import {render, screen} from '@testing-library/react';

import Group from './group';

describe('Group', () => {
  const renderGroup = (props?: HTMLAttributes<HTMLDivElement>) => render(<Group {...props} />);

  it('should create component', () => {
    renderGroup();
    expect(screen.getByTestId('ring-group')).to.exist;
  });

  it('should wrap children with div', () => {
    renderGroup();
    expect(screen.getByTestId('ring-group')).to.have.tagName('span');
  });

  it('should use passed className', () => {
    renderGroup({className: 'test-class'});
    expect(screen.getByTestId('ring-group')).to.have.class('test-class');
  });
});
