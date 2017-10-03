/* @flow */
export type ItemType = {
  id: number,
  title: any,
  selectable?: boolean,
  items: ItemType[]
};
