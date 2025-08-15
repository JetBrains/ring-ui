import PopupMenu, {ListProps} from './popup-menu';

export default {
  title: 'Components/PopupMenu',

  parameters: {
    notes: 'Displays a popup menu.',
    screenshots: {captureSelector: '*[data-test~=ring-popup]'},
    a11y: {context: '#storybook-root,*[data-test~=ring-popup]'},
  },
};

export const basic = () => {
  const data = [
    {label: 'Item'},
    {label: 'Link to jetbrains.com', href: 'http://www.jetbrains.com'},
    {rgItemType: ListProps.Type.SEPARATOR},
    {rgItemType: ListProps.Type.LINK, label: 'Link Item'},
    {
      rgItemType: ListProps.Type.LINK,
      label: 'Link Item With Additional Class',
      className: 'test',
    },
    {rgItemType: ListProps.Type.SEPARATOR, description: 'Separator With Description'},
    {rgItemType: ListProps.Type.TITLE, label: 'Title'},
    {rgItemType: ListProps.Type.ITEM, label: '1 Element in group'},
    {rgItemType: ListProps.Type.ITEM, label: '2 Element in group'},
  ];

  return <PopupMenu cssPositioning data={data} />;
};

basic.storyName = 'PopupMenu';
