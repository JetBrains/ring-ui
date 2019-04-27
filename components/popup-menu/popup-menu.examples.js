import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import PopupMenu, {ListProps} from './popup-menu';

storiesOf('Components|PopupMenu', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
    const data = [
      {label: 'Item'},
      {label: 'Link to jetbrains.com', href: 'http://www.jetbrains.com'},
      {rgItemType: ListProps.Type.SEPARATOR},
      {rgItemType: ListProps.Type.LINK, label: 'Link Item'},
      {rgItemType: ListProps.Type.LINK, label: 'Link Item With Additional Class', className: 'test'},
      {rgItemType: ListProps.Type.SEPARATOR, description: 'Separator With Description'},
      {rgItemType: ListProps.Type.TITLE, label: 'Title'},
      {rgItemType: ListProps.Type.ITEM, label: '1 Element in group'},
      {rgItemType: ListProps.Type.ITEM, label: '2 Element in group'}
    ];

    return <PopupMenu data={data}/>;
  });
