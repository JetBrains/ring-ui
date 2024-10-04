import {HTMLAttributes} from 'react';

import {render, screen} from '@testing-library/react';

import Group from './group';

describe('Group', () => {
  const renderGroup = (props?: HTMLAttributes<HTMLDivElement>) => render(<Group {...props}/>);

  it('should create component', () => {
    renderGroup();
    screen.getByTestId('ring-group').should.exist;
  });

  it('should wrap children with div', () => {
    renderGroup();
    screen.getByTestId('ring-group').should.have.tagName('span');
  });

  it('should use passed className', () => {
    renderGroup({className: 'test-class'});
    screen.getByTestId('ring-group').should.have.class('test-class');
  });
});
