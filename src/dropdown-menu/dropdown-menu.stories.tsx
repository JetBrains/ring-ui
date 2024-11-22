import * as React from 'react';

import chevronRight from '@jetbrains/icons/chevron-right';

import {Directions} from '../popup/popup.consts';
import Icon from '../icon';
import Group from '../group/group';

import {ListDataItem} from '../list/consts';

import DropdownMenu, {DropdownMenuProps} from './dropdown-menu';

export default {
  title: 'Components/DropdownMenu',

  parameters: {
    notes: 'Displays a menu in a dropdown.',
    screenshots: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-dropdown]'},
        {
          type: 'capture',
          name: 'dropdown',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
        },
      ],
    },
    a11y: {element: '#storybook-root,*[data-test~=ring-dropdown]'},
  },
};

export const basic = () => {
  const data = [
    {label: 'Item'},
    {label: 'Link to jetbrains.com', href: 'http://www.jetbrains.com'},
    {rgItemType: DropdownMenu.ListProps.Type.SEPARATOR},
    {rgItemType: DropdownMenu.ListProps.Type.LINK, label: 'Link Item'},
    {
      rgItemType: DropdownMenu.ListProps.Type.LINK,
      label: 'Link Item With Additional Class',
      className: 'test',
    },
    {rgItemType: DropdownMenu.ListProps.Type.SEPARATOR, description: 'Separator With Description'},
    {rgItemType: DropdownMenu.ListProps.Type.TITLE, label: 'Title'},
    {rgItemType: DropdownMenu.ListProps.Type.ITEM, label: '1 Element in group'},
    {rgItemType: DropdownMenu.ListProps.Type.ITEM, label: '2 Element in group'},
  ];

  return <DropdownMenu data={data} anchor={'Click me!'} />;
};

basic.storyName = 'DropdownMenu';

export const nested = () => {
  interface NestedMenuProps {
    title: string;
    data?: ListDataItem[];
    children?: React.ReactNode;
  }

  interface MenuItem extends ListDataItem {
    submenu?: MenuItem[] | React.ReactNode;
  }

  const NestedMenuItem = (props: NestedMenuProps) => {
    const anchor: DropdownMenuProps['anchor'] = ({active}, ariaProps = {}) => (
      <Group
        role="menu"
        className="nested-menu-item"
        {...{'aria-expanded': active, 'aria-label': props.title}}
        {...ariaProps}
      >
        <span className="nested-menu-title">{props.title}</span>

        <Icon glyph={chevronRight} className="chevron-icon" />
      </Group>
    );

    const dropdownProps: DropdownMenuProps = {
      hoverMode: true,
      hoverShowTimeOut: 50,
      hoverHideTimeOut: 100,
      anchor,
    };

    const menuProps: DropdownMenuProps['menuProps'] = {
      directions: [Directions.RIGHT_BOTTOM, Directions.LEFT_BOTTOM, Directions.RIGHT_TOP, Directions.LEFT_TOP],
      left: 20,
      top: -12,
      minWidth: 150,
      ['data-test']: 'nested-menu',
      hidden: false,
      activateFirstItem: false,
    };

    if (props.data) {
      // dropdown menu has automatic support for aria-navigation
      return <DropdownMenu {...dropdownProps} data={props.data} menuProps={menuProps} />;
    }

    return <DropdownMenu {...dropdownProps} menuProps={menuProps} />;
  };

  const menu: MenuItem[] = [
    {label: 'Option 1', key: 'item1'},
    {
      label: 'Option 2',
      key: 'nested-parent',
      submenu: [
        {label: 'Option 2-1', key: 'nested-item1'},
        {label: 'Option 2-2', key: 'nested-item2'},
        {label: 'Option 2-3', key: 'nested-item3'},
        {label: 'Option 2-4', key: 'nested-item4'},
      ],
    },
    {
      label: 'Option 3',
      key: 'item3',
      submenu: [
        {label: 'Option 3-1', key: 'nested-item1'},
        {label: 'Option 3-2', key: 'nested-item2'},
        {label: 'Option 3-3', key: 'nested-item3'},
        {label: 'Option 3-4', key: 'nested-item4'},
      ],
    },
  ];

  const data: ListDataItem[] = menu.reduce((acc, menuItem) => {
    const {submenu, ...rest} = menuItem;

    if (!submenu) {
      acc.push(menuItem);
      return acc;
    }

    const secondLevelRoot: ListDataItem = {
      rgItemType: DropdownMenu.ListProps.Type.CUSTOM,
      key: menuItem.key,
      template: (
        <button type="button" className="nested-menu-button" onClick={e => e.stopPropagation()}>
          <NestedMenuItem
            title={rest.label as string}
            data={Array.isArray(submenu) ? (submenu as ListDataItem[]) : undefined}
          >
            {submenu as React.ReactNode}
          </NestedMenuItem>
        </button>
      ),
    };
    acc.push(secondLevelRoot);

    return acc;
  }, [] as ListDataItem[]);

  return <DropdownMenu anchor="Click me" data={data} menuProps={{minWidth: 200, activateFirstItem: false}} />;
};

nested.storyName = 'DropdownMenu nested';

nested.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test~=ring-dropdown]'},
      {type: 'click', selector: '[aria-label="Option 2"]'},
      {type: 'mouseMove', selector: '[title="Option 2-1"]'},
      {
        type: 'capture',
        name: 'dropdown',
        selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]', '[data-test~=nested-menu]'],
      },
    ],
  },
  storyStyles: `
<style>
  .chevron-icon {
    color: var(--ring-secondary-color)
  }
  .nested-menu-item {
    display: flex;
    width: 100%;
  }
  .nested-menu-title {
    flex-grow: 1;
  }
  .nested-menu-button {
    all: unset;
    display: flex;
    width: 100%;
  }
  .nested-menu-button > * {
    width: 100%;
  }
</style>`,
};
