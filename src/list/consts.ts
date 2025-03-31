import {ComponentType, ReactNode, ReactElement, SyntheticEvent} from 'react';
import * as React from 'react';

import {LinkProps} from '../link/link';
import {IconType, Size} from '../icon/icon';
import {ClickableLinkProps} from '../link/clickableLink';

/**
 * @enum {number}
 */
export enum Type {
  SEPARATOR = 0,
  LINK = 1,
  ITEM = 2,
  HINT = 3, // doesn't work, TODO remove in 8.0
  CUSTOM = 4,
  TITLE = 5,
  MARGIN = 6,
}

export const Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 32,
  COMPACT_ITEM_HEIGHT: 24,
  SEPARATOR_HEIGHT: 25,
  SEPARATOR_FIRST_HEIGHT: 16,
  SEPARATOR_TEXT_HEIGHT: 18,
  TITLE_HEIGHT: 42,
  INNER_PADDING: 8,
  MARGIN: 8,
};

export const DEFAULT_ITEM_TYPE = Type.ITEM;

export type ListDataItem<T = unknown> = T &
  Partial<Omit<LinkProps, 'onClick' | 'onMouseUp'>> & {
    rgItemType?: Type | null | undefined;
    key?: string | number | null | undefined;
    disabled?: boolean | undefined;
    details?: string | null | undefined;
    hoverClassName?: string | null | undefined;
    compact?: boolean | null | undefined;
    className?: string | null | undefined;
    url?: string | undefined;
    showGeneratedAvatar?: boolean | null | undefined;
    username?: string | null | undefined;
    avatar?: string | null | undefined;
    subavatar?: string | null | undefined;
    glyph?: IconType | string | null | undefined;
    icon?: string | undefined;
    /**
     * @deprecated Use icons with appropriate intrinsic sizes instead
     */
    iconSize?: Size | null | undefined;
    suppressSizeWarning?: boolean | null | undefined;
    rightGlyph?: IconType | string | null | undefined;
    title?: string | null | undefined;
    level?: number | null | undefined;
    checkbox?: boolean | undefined;
    description?: ReactNode;
    label?: ReactNode;
    rightNodes?: ReactNode;
    leftNodes?: ReactNode;
    tagName?: keyof JSX.IntrinsicElements | null | undefined;
    selectedLabel?: string | null | undefined;
    originalModel?: never;
    LinkComponent?: ComponentType<ClickableLinkProps> | string | null | undefined;
    template?: ReactNode | ((props: ListDataItemProps<T>) => ReactNode);
    labelWrapper?: (children: ReactNode) => ReactElement;
    custom?: boolean | null | undefined;
    onClick?: ((item: ListDataItem<T>, event: Event | SyntheticEvent) => void) | null | undefined;
    onMouseUp?: ((item: ListDataItem<T>, event: Event | SyntheticEvent) => void) | null | undefined;
  };

export interface ListDataItemAddProps {
  className?: string;
  compact?: boolean | null | undefined;
  hover: boolean;
  onMouseOver: (e: SyntheticEvent) => void;
  tabIndex: number;
  scrolling: boolean;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick: (e: SyntheticEvent) => void;
  onCheckboxChange: (e: React.ChangeEvent) => void;
  isFirst?: boolean;
  'data-test'?: string | null | undefined;
}

export type ListDataItemProps<T = unknown> = Omit<ListDataItem<T>, keyof ListDataItemAddProps> & ListDataItemAddProps;
