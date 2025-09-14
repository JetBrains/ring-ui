import {getByTestId, queryAllByTestId, render, screen} from '@testing-library/react';

import PopupMenu, {type PopupMenuAttrs} from './popup-menu';

describe('Popup Menu', () => {
  const renderPopupMenu = (props?: PopupMenuAttrs) => {
    render(<PopupMenu {...props} />);
    return screen.getByTestId('ring-popup');
  };

  it('should create component', () => {
    expect(renderPopupMenu()).to.exist;
  });

  it('should have List', () => {
    renderPopupMenu();
    const list = screen.getByRole('grid');

    // We need it to maintain compatibility between Popup Menu and List
    expect(queryAllByTestId(list, 'ring-list-item-action ring-list-item')).to.have.length(0);
  });

  it('should pass params to List', () => {
    renderPopupMenu({data: [{}]});

    const maybeList = screen.getByRole('grid');
    expect(maybeList).to.exist;

    expect(getByTestId(maybeList, 'ring-list-item-action ring-list-item')).to.exist;
  });
});
