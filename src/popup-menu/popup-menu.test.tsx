import {getByTestId, queryAllByTestId, render, screen} from '@testing-library/react';

import PopupMenu, {PopupMenuAttrs} from './popup-menu';

describe('Popup Menu', () => {
  const renderPopupMenu = (props?: PopupMenuAttrs) => {
    render(<PopupMenu {...props} />);
    return screen.getByTestId('ring-popup');
  };

  it('should create component', () => {
    renderPopupMenu().should.exist;
  });

  it('should have List', () => {
    renderPopupMenu();
    const list = screen.getByRole('grid');

    // We need it to maintain compatibility between Popup Menu and List
    queryAllByTestId(list, 'ring-list-item-action ring-list-item').should.have.length(0);
  });

  it('should pass params to List', () => {
    renderPopupMenu({data: [{}]});

    const maybeList = screen.getByRole('grid');
    should.exist(maybeList);

    getByTestId(maybeList, 'ring-list-item-action ring-list-item').should.exist;
  });
});
