import {render, screen} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import {act} from 'react';

import DropdownMenu, {DropdownMenuProps} from './dropdown-menu';

const waitForCondition = (condition: () => boolean, rejectMessage: string) =>
  new Promise<void>((resolve, reject) => {
    const interval = 10;
    const maxWaitingTime = 2000;
    let remainingTime = maxWaitingTime;

    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        resolve();
      } else if (remainingTime < 0) {
        clearInterval(intervalId);
        reject(new Error(rejectMessage));
      } else {
        remainingTime -= interval;
      }
    }, interval);
  });

describe('Dropdown Menu', () => {
  const renderDropdownMenu = <T,>(props: DropdownMenuProps<T>) => render(<DropdownMenu id="test-list-id" {...props} />);

  const renderAndWaitForMenuContent = async <T,>(props: DropdownMenuProps<T>) => {
    renderDropdownMenu(props);

    await userEvent.click(screen.getByRole('button'));
    await act(() =>
      waitForCondition(() => !!screen.queryByTestId('ring-popup'), 'List was not rendered in a dropdown menu'),
    );
  };

  it('should create component', async () => {
    await renderAndWaitForMenuContent({anchor: 'Anchor text'});
    screen.getByTestId('ring-popup').should.exist;
  });

  it('should open List', async () => {
    await renderAndWaitForMenuContent({anchor: 'Anchor text'});

    const list = screen.getByTestId('ring-list');
    list.should.exist;

    //We need it to maintain compatibility between Dropdown Menu and List
    list.querySelectorAll('[data-test~=ring-list-item]').length.should.equal(0);
  });

  it('should pass params to List', async () => {
    await renderAndWaitForMenuContent({
      anchor: 'Anchor text',
      data: [{key: 'key1'}],
    });

    should.exist(screen.getByTestId('ring-list').querySelector('[data-test~=ring-list-item]'));
  });

  it('should add accessibility attributes to anchor', async () => {
    await renderAndWaitForMenuContent({
      anchor: 'Anchor text',
      data: [{key: 'key1'}, {key: 'key2'}],
    });

    const anchor = screen.getByRole('button', {name: /^Anchor text/});
    anchor.getAttribute('aria-owns')!.should.equal('test-list-id');
    anchor.getAttribute('aria-activedescendant')!.should.contain(':key1');
  });
});
