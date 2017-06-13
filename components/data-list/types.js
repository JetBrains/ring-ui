/* @flow */
export type SubitemType = {
  type: 'subitem',
  id: number,
  title: any
};

export type ItemType = {
  type: 'item',
  id: number,
  title: any,
  selectable?: boolean,
  subitems?: SubitemType[]
};

export type GroupType = {
  type: 'group',
  id: number,
  title: any,
  size: number,
  selectable?: boolean,
  items: ItemType[]
};
