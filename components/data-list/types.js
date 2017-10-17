/* @flow */
export const moreLessStates = {
  UNUSED: 0,
  MORE: 1,
  MORE_LOADING: 2,
  LESS: 3
};

export type MoreLessState =
  typeof moreLessStates.UNUSED |
  typeof moreLessStates.MORE |
  typeof moreLessStates.MORE_LOADING |
  typeof moreLessStates.LESS;

export type ItemType = {
  key: number|string,
  title: any,
  children?: ItemType[],
  selectable?: boolean,
  collapsible?: boolean,
  collapsed?: boolean,
  moreLessState?: MoreLessState,
  onCollapse?: () => void,
  onExpand?: () => void
};
