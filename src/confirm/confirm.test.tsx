import {render, screen} from '@testing-library/react';

import Confirm from './confirm';

import islandStyles from '../island/island.css';

describe('Confirm', () => {
  const renderConfirm = (cancelIsDefault = false) => {
    render(<Confirm show native={false} text='Foo' cancelIsDefault={cancelIsDefault} />);
    return screen.getByRole('dialog');
  };

  it('should create component', () => {
    expect(renderConfirm()).to.exist;
  });

  it('should render confirm', () => {
    expect(renderConfirm()).to.contain(`.${islandStyles.title}`);
  });

  it.each([
    [false, ['Cancel', 'OK']],
    [true, ['OK', 'Cancel']],
  ])('should place the primary action last when cancelIsDefault is %s', (cancelIsDefault, labels) => {
    renderConfirm(cancelIsDefault as boolean);
    expect(screen.getAllByRole('button').map(button => button.textContent)).to.deep.equal(labels);
  });
});
