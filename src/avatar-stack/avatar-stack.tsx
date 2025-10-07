import {Children, type HTMLAttributes, useState} from 'react';
import classNames from 'classnames';

import {type ListDataItem} from '../list/consts';
import DropdownMenu, {type DropdownMenuProps} from '../dropdown-menu/dropdown-menu';
import Avatar, {Size} from '../avatar/avatar';
import {fontSizes} from '../avatar/avatar-info';

import styles from './avatar-stack.css';

declare module 'csstype' {
  interface Properties {
    '--ring-avatar-stack-index'?: number;
  }
}

export interface AvatarProps<T = unknown> extends HTMLAttributes<HTMLDivElement> {
  size?: Size | undefined;
  extraItems?: readonly ListDataItem<T>[] | null | undefined;
  dropdownMenuProps?: DropdownMenuProps<T> | null | undefined;
}

export default function AvatarStack({
  children,
  className,
  size = Size.Size20,
  extraItems,
  dropdownMenuProps,
  ...restProps
}: AvatarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className={classNames(styles.avatarStack, className, styles[`size${size}`], {
        [styles.hovered]: dropdownOpen,
      })}
      {...restProps}
      style={{height: size, ...restProps.style}}
    >
      {Children.map(children, (child, index) => (
        <div className={styles.item} style={{'--ring-avatar-stack-index': index}}>
          {child}
        </div>
      ))}
      {extraItems?.length ? (
        <DropdownMenu
          hoverMode
          hoverShowTimeOut={10}
          onShow={() => setDropdownOpen(true)}
          onHide={() => setDropdownOpen(false)}
          className={styles.extra}
          style={{
            width: size,
            height: size,
            '--ring-avatar-stack-index': Children.count(children),
            fontSize: fontSizes[size],
          }}
          anchor={(
            <button type='button' className={styles.extraButton}>
              <Avatar size={size} info={<span className={styles.extraText}>{`+${extraItems.length}`}</span>} />
            </button>
          )}
          data={extraItems}
          menuProps={{offset: 4, ...dropdownMenuProps?.menuProps}}
          {...dropdownMenuProps}
        />
      ) : null}
    </div>
  );
}
