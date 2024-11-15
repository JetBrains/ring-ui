import {memo, useCallback, useMemo, ReactElement, ReactNode} from 'react';

import classNames from 'classnames';

import {Directions} from '../popup/popup.consts';
import PopupMenu, {ListProps} from '../popup-menu/popup-menu';

import Dropdown from '../dropdown/dropdown';

import {ListDataItem} from '../list/consts';

import {ButtonButtonProps, ContainerProps} from '../button/button';

import Anchor from '../dropdown/anchor';

import styles from './tabs.css';
import getTabTitles from './collapsible-tab';
import {CustomItem} from './custom-item';
import {TabProps} from './tab';

export interface FakeMoreButtonProps {
  hasActiveChildren: boolean;
  moreClassName?: string | null | undefined;
  moreActiveClassName?: string | null | undefined;
}
export const AnchorLink = ({
  hasActiveChildren,
  moreClassName,
  moreActiveClassName,
  ...restProps
}: Omit<ContainerProps<ButtonButtonProps>, 'children'> & FakeMoreButtonProps) => {
  const classnames = classNames(
    styles.title,
    hasActiveChildren && styles.selected,
    hasActiveChildren && moreActiveClassName,
    moreClassName,
  );
  return (
    <Anchor title={'More'} className={classnames} {...restProps}>
      {'More'}
    </Anchor>
  );
};

const morePopupDirections = [Directions.BOTTOM_CENTER, Directions.BOTTOM_LEFT, Directions.BOTTOM_RIGHT];
export interface MoreButtonProps {
  items: ReactElement<TabProps>[];
  selected?: string | undefined;
  onSelect: (key: string) => () => void;
  moreClassName?: string | null | undefined;
  moreActiveClassName?: string | null | undefined;
  morePopupClassName?: string | null | undefined;
  morePopupItemClassName?: string | undefined;
  morePopupBeforeEnd: ReactNode;
}
export const MoreButton = memo(
  ({
    items,
    selected,
    onSelect,
    moreClassName,
    moreActiveClassName,
    morePopupClassName,
    morePopupItemClassName,
    morePopupBeforeEnd,
  }: MoreButtonProps) => {
    const onSelectHandler = useCallback(
      (listItem: ListDataItem) => {
        if (listItem.disabled === true || listItem.custom === true) {
          return;
        }

        const cb = onSelect(String(listItem.key));
        cb();
      },
      [onSelect],
    );

    const hasActiveChild = useMemo(
      () => items.some(item => item.props.alwaysHidden && item.props.id === selected),
      [items, selected],
    );

    const data = useMemo(() => {
      const popupItems: ListDataItem[] = getTabTitles({
        items,
        selected,
        collapsed: true,
      }).map(tab => {
        const disabled = tab.props.disabled === true;
        const custom = tab.props.child.type === CustomItem;

        return {
          template: tab,
          key: tab.key,
          rgItemType: ListProps.Type.CUSTOM,
          className: morePopupItemClassName,
          disabled,
          custom,
        };
      });

      if (morePopupBeforeEnd) {
        popupItems.push({
          template: morePopupBeforeEnd,
          key: 'before-end-content',
          className: styles.morePopupBeforeEnd,
          rgItemType: ListProps.Type.CUSTOM,
        });
      }

      return popupItems;
    }, [items, morePopupBeforeEnd, morePopupItemClassName, selected]);

    const popupAnchor = useMemo(
      () => (
        <AnchorLink
          moreClassName={moreClassName}
          moreActiveClassName={moreActiveClassName}
          hasActiveChildren={hasActiveChild}
        />
      ),
      [hasActiveChild, moreActiveClassName, moreClassName],
    );

    const popup = useMemo(
      () => (
        <PopupMenu
          directions={morePopupDirections}
          className={morePopupClassName}
          onSelect={onSelectHandler}
          data={data}
        />
      ),
      [data, morePopupClassName, onSelectHandler],
    );

    if (items.length === 0) {
      return null;
    }

    return (
      <div className={classNames(styles.title, moreClassName, hasActiveChild && moreActiveClassName)}>
        <Dropdown hoverMode anchor={popupAnchor}>
          {popup}
        </Dropdown>
      </div>
    );
  },
);

MoreButton.displayName = 'MoreButton';

export const FakeMoreButton = memo(({moreClassName, moreActiveClassName, hasActiveChildren}: FakeMoreButtonProps) => (
  <div className={classNames(styles.moreButton, styles.title)}>
    <AnchorLink
      moreClassName={moreClassName}
      moreActiveClassName={moreActiveClassName}
      hasActiveChildren={hasActiveChildren}
      tabIndex={-1}
      disabled
    />
  </div>
));
FakeMoreButton.displayName = 'FakeMoreButton';
