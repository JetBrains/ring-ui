/* @flow */
export type ItemType = {
  id: number,
  title: any,
  selectable?: boolean,
  collapsible?: boolean,
  collapsed?: boolean,
  items?: ItemType[],
  onCollapse: () => void,
  onExpand: () => void
};
