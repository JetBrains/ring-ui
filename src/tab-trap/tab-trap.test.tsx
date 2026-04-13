import {render, screen} from '@testing-library/react';

import Input from '../input/input';
import TabTrap from './tab-trap';

describe('TabTrap', () => {
  it('should clear focus when TabTrap is removed', () => {
    const {rerender} = render(
      <div>
        <button type='button'>{'Before'}</button>
        <TabTrap>
          <Input placeholder='inside trap' autoFocus />
        </TabTrap>
        <button type='button'>{'After'}</button>
      </div>,
    );

    expect(screen.getByPlaceholderText('inside trap')).to.equal(document.activeElement);

    rerender(
      <div>
        <button type='button'>{'Before'}</button>
        <button type='button'>{'After'}</button>
      </div>,
    );

    expect(document.activeElement).to.equal(document.body);
  });

  it('should restore focus to previously focused element when TabTrap exits with focusBackOnExit', () => {
    const renderContent = (withTabTrap: boolean) => (
      <div>
        <button type='button'>{'Open dropdown'}</button>
        {withTabTrap ? (
          <TabTrap focusBackOnExit>
            <Input placeholder='inside trap' autoFocus />
          </TabTrap>
        ) : null}
      </div>
    );

    const {rerender} = render(renderContent(false));

    const openDropdownButton = screen.getByRole('button', {name: 'Open dropdown'});
    openDropdownButton.focus();
    expect(document.activeElement).to.equal(openDropdownButton);

    rerender(renderContent(true));
    expect(screen.getByPlaceholderText('inside trap')).to.equal(document.activeElement);

    rerender(renderContent(false));
    expect(document.activeElement).to.equal(openDropdownButton);
  });
});
