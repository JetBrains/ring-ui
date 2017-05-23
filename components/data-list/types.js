/* @flow */
export type SubitemType = {
  id: number,
  title: any
};

export type ItemType = {
  id: number,
  title: any,
  selectable?: boolean,
  subitems?: SubitemType[]
};

export type GroupType = {
  id: number,
  title: any,
  size: number,
  items: ItemType[]
};
