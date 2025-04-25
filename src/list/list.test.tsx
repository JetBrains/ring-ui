import {act, createElement} from 'react';
import checkmarkIcon from '@jetbrains/icons/checkmark';

import {render, screen} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import getUID from '../global/get-uid';

import simulateCombo from '../../test-helpers/simulate-combo';

import List, {ListAttrs} from './list';
import styles from './list.css';
import {Type} from './consts';

describe('List', () => {
  const renderList = (props: ListAttrs) => render(<List renderOptimization={false} {...props} />);

  describe('virtualized', () => {
    function createItemMock(itemType: Type) {
      return {
        rgItemType: itemType,
        label: getUID('list-test-'),
      };
    }

    it('should pad the list with top/bottom margins', () => {
      const data = [createItemMock(List.ListProps.Type.ITEM), createItemMock(List.ListProps.Type.ITEM)];

      renderList({data});
      expect(screen.getAllByRole('row')[0]).to.have.tagName('div');
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(screen.getAllByRole('row')[3]).to.have.tagName('div');
    });
  });

  it('should check type of item', () => {
    const itemMock = {
      rgItemType: Type.SEPARATOR,
    };

    expect(List.isItemType(Type.SEPARATOR, itemMock)).to.been.equal(true);
  });

  it('by default item has type equal ITEM', () => {
    const itemMock = {};

    expect(List.isItemType(Type.ITEM, itemMock)).to.been.equal(true);
    expect(List.isItemType(Type.SEPARATOR, itemMock)).to.been.equal(false);
  });

  describe('should track activeIndex', () => {
    let rerender: (ui: React.ReactNode) => void;
    const props = {
      data: [
        {key: 0, label: 'Item 0'},
        {key: 1, label: 'Item 1'},
        {key: 2, label: 'Item 2'},
      ],
      activeIndex: 0,
      restoreActiveIndex: true,
      shortcuts: true,
    };
    beforeEach(() => {
      rerender = renderList(props).rerender;
    });

    it('should select active item from props', () => {
      expect(screen.getByRole('row', {selected: true})).to.have.text('Item 0');
    });

    it('should activate item', () => {
      act(() => simulateCombo('down'));
      expect(screen.getByRole('row', {selected: true})).to.have.text('Item 1');
    });

    it("should reset active item when it's changed in props", () => {
      act(() => simulateCombo('down'));
      rerender(<List renderOptimization={false} {...props} activeIndex={2} />);
      expect(screen.getByRole('row', {selected: true})).to.have.text('Item 2');
    });

    it('should reset active item when data changed', () => {
      act(() => simulateCombo('down'));
      rerender(<List renderOptimization={false} {...props} data={[{key: 5}]} />);

      expect(screen.queryByRole('row', {selected: true})).to.not.exist;
    });

    it("shouldn't reset activeIndex when it isn't changed in props", () => {
      act(() => simulateCombo('down'));
      rerender(<List renderOptimization={false} {...props} />);

      expect(screen.getByRole('row', {selected: true})).to.have.text('Item 1');
    });
  });

  describe('should render items', () => {
    it('should render for empty element', () => {
      renderList({
        data: [{}],
      });
      const firstItem = screen.getByRole('button');
      expect(firstItem).to.have.class(styles.action);
      expect(firstItem).to.have.text('');
    });

    it('should render instance item if type is not defined', () => {
      renderList({
        data: [{label: 'Hello!'}],
      });

      expect(screen.getByTestId('ring-list-item-action ring-list-item')).to.exist;
    });

    it('should render a if href defined', () => {
      renderList({
        data: [{label: 'Hello!', href: 'http://www.jetbrains.com'}],
      });

      const firstItem = screen.getByRole('link');
      expect(firstItem).to.exist;
      expect(firstItem.parentElement!.getAttribute('data-test')!).to.include('ring-list-link');
      expect(firstItem).to.have.text('Hello!');
      expect(firstItem).to.have.tagName('a');
      expect(firstItem).to.have.attr('href', 'http://www.jetbrains.com');
    });

    it('should render a if url defined', () => {
      renderList({
        data: [{label: 'Hello!', url: 'http://www.jetbrains.com'}],
      });

      const firstItem = screen.getByRole('link');
      expect(firstItem).to.exist;
      expect(firstItem.parentElement!.getAttribute('data-test')!).to.include('ring-list-link');
      expect(firstItem).to.have.text('Hello!');
      expect(firstItem).to.have.tagName('a');
      expect(firstItem).to.have.attr('href', 'http://www.jetbrains.com');
    });

    it('should render separator', () => {
      renderList({
        data: [{rgItemType: List.ListProps.Type.SEPARATOR, label: 'test'}],
      });

      const firstItem = screen.getByTestId('ring-list-separator');
      expect(firstItem).to.exist;
      expect(firstItem).to.have.class(styles.separator);
    });

    it('should render title', () => {
      renderList({
        data: [{rgItemType: List.ListProps.Type.TITLE, label: 'Foo', description: 'Bar'}],
      });

      const firstItem = screen.getByTestId('ring-list-title');
      expect(firstItem).to.exist;
      expect(firstItem).to.have.text('FooBar');
    });

    it('should render pseudo link if link without href', () => {
      renderList({
        data: [{label: 'Hello!', rgItemType: List.ListProps.Type.LINK}],
      });

      const firstItem = screen.getByRole('button');
      expect(firstItem).to.exist;
      expect(firstItem.parentElement!.getAttribute('data-test')!).to.include('ring-list-link');
      expect(firstItem).to.have.text('Hello!');
    });

    it('should not render icon if not provided', () => {
      renderList({
        data: [{label: 'Hello!', rgItemType: List.ListProps.Type.ITEM}],
      });

      const firstItem = screen.getByTestId('ring-list-item-action ring-list-item');
      expect(firstItem).to.not.have.descendants(`.${styles.icon}`);
    });

    it('should render icon if provided', () => {
      renderList({
        data: [{label: 'Hello!', icon: 'http://some.url/', rgItemType: List.ListProps.Type.ITEM}],
      });

      const icon = screen
        .getByTestId('ring-list-item-action ring-list-item')
        .querySelector<HTMLElement>(`.${styles.icon}`);
      const backgroundImage = icon?.style?.backgroundImage;
      expect(backgroundImage).to.exist;
      expect(backgroundImage).to.contain('http://some.url');
    });

    it('should not render glyph if not provided', () => {
      renderList({
        data: [{label: 'Hello!', rgItemType: List.ListProps.Type.ITEM}],
      });

      expect(screen.queryByTestId('ring-icon')).to.not.exist;
    });

    it('should render glyph if provided', () => {
      renderList({
        data: [{label: 'Hello!', glyph: checkmarkIcon, rgItemType: List.ListProps.Type.ITEM}],
      });

      expect(screen.getByTestId('ring-icon').querySelector('svg')!.outerHTML.replace(' class="glyph"', '')).to.equal(
        checkmarkIcon.replace('/>', '></path>'),
      );
    });

    it('should throw error on unknown type', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        renderList({
          data: [
            // @ts-expect-error testing a wrong usage
            {label: 'Hello!', rgItemType: 'none'},
          ],
        });
      }).to.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', async () => {
      const clicked = sandbox.stub();

      renderList({
        data: [{label: 'Hello!', onClick: clicked}],
      });

      const firstItem = screen.getByRole('button');
      const user = userEvent.setup();
      await user.click(firstItem);
      expect(clicked).to.have.been.called;
    });

    it('should handle select', async () => {
      const onSelect = sandbox.stub();

      renderList({
        onSelect,
        data: [{label: 'Hello!'}],
      });

      const firstItem = screen.getByRole('button');
      const user = userEvent.setup();
      await user.click(firstItem);
      expect(onSelect).to.have.been.called;
    });

    it('Should support custom elements', () => {
      renderList({
        data: [
          {
            template: createElement('span', {}, 'custom item'),
            key: 1,
            rgItemType: List.ListProps.Type.CUSTOM,
          },
        ],
      });

      const firstItem = screen.getByRole('button');
      expect(firstItem).to.have.text('custom item');
    });

    it('Should support click on custom elements', async () => {
      const onClick = sandbox.stub();
      renderList({
        data: [
          {
            template: createElement('span', {}, 'custom item'),
            key: 1,
            rgItemType: List.ListProps.Type.CUSTOM,
            onClick,
          },
        ],
      });

      const firstItem = screen.getByRole('button');
      const user = userEvent.setup();
      await user.click(firstItem);
      expect(onClick).to.have.been.called;
    });

    it('Should support disable property for custom elements', () => {
      renderList({
        data: [
          {
            template: createElement('span', {}, 'custom item'),
            key: 1,
            rgItemType: List.ListProps.Type.CUSTOM,
            disabled: true,
          },
        ],
      });

      const firstItem = screen.getByRole('button');
      expect(firstItem).to.not.have.class(styles.action);
    });
  });
});
