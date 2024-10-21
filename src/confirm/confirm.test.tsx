import {render, screen} from '@testing-library/react';

import islandStyles from '../island/island.css';

import Confirm from './confirm';

describe('Confirm', () => {
  const renderConfirm = () => {
    render(<Confirm show text="Foo" />);
    return screen.getByRole('dialog');
  };

  it('should create component', () => {
    renderConfirm().should.exist;
  });

  it('should render confirm', () => {
    renderConfirm().should.contain(`.${islandStyles.title}`);
  });
});
