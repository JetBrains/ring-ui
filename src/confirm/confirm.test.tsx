import {render, screen} from '@testing-library/react';

import Confirm from './confirm';

import islandStyles from '../island/island.css';

describe('Confirm', () => {
  const renderConfirm = () => {
    render(<Confirm show text='Foo' />);
    return screen.getByRole('dialog');
  };

  it('should create component', () => {
    expect(renderConfirm()).to.exist;
  });

  it('should render confirm', () => {
    expect(renderConfirm()).to.contain(`.${islandStyles.title}`);
  });
});
