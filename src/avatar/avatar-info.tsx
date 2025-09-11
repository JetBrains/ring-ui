import {type ReactNode} from 'react';
import classNames from 'classnames';

import styles from './avatar.css';
import {Size} from './avatar-size';

interface InfoAvatarProps {
  size: Size;
  children?: ReactNode;
}

export const fontSizes: Record<Size, number> = {
  [Size.Size16]: 9,
  [Size.Size18]: 9,
  [Size.Size20]: 9,
  [Size.Size24]: 11,
  [Size.Size28]: 12,
  [Size.Size32]: 14,
  [Size.Size40]: 16,
  [Size.Size48]: 16,
  [Size.Size56]: 22,
};

export default function AvatarInfo({size, children}: InfoAvatarProps) {
  const fontSize = fontSizes[size];
  return (
    <span style={{fontSize}} className={classNames(styles.avatarInfo)}>
      {children}
    </span>
  );
}
