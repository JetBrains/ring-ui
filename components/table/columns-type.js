/* @flow */
export type Columns = {
  className: string,
  id: number,
  title: string,
  sortable: boolean,
  getValue: () => {},
  rightAlign: boolean
};
