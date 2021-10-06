import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import DropdownMenu from '@jetbrains/ring-ui/components/dropdown-menu/dropdown-menu';

export default {
  title: 'Components/DropdownMenu',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a menu in a dropdown.',
    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-dropdown]'},
        {
          type: 'capture',
          name: 'dropdown',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]']
        }
      ]
    },
    a11y: {element: '*[data-test~=ring-dropdown]'}
  }
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
      className: 'test'
    },
    {rgItemType: DropdownMenu.ListProps.Type.SEPARATOR, description: 'Separator With Description'},
    {rgItemType: DropdownMenu.ListProps.Type.TITLE, label: 'Title'},
    {rgItemType: DropdownMenu.ListProps.Type.ITEM, label: '1 Element in group'},
    {rgItemType: DropdownMenu.ListProps.Type.ITEM, label: '2 Element in group'}
  ];

  return <DropdownMenu data={data} anchor={'Click me!'}/>;
};

basic.storyName = 'DropdownMenu';
