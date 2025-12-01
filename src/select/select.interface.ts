import type {ListDataItem} from '../list/consts';

export enum Type {
  BUTTON = 'BUTTON',
  INPUT = 'INPUT',
  CUSTOM = 'CUSTOM',
  INLINE = 'INLINE',
  INPUT_WITHOUT_CONTROLS = 'INPUT_WITHOUT_CONTROLS',
}

export type SelectItemData<T> = T & {
  key: string | number;
  isResetItem?: boolean | null | undefined;
  separator?: boolean | null | undefined;
};

export type SelectItem<T = unknown> = ListDataItem<SelectItemData<T>>;
