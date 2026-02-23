import {memo, type ReactNode} from 'react';

import Link, {type LinkProps} from '../link/link';

import styles from './tabs.css';

export interface TabLinkProps extends Omit<LinkProps, 'title' | 'children'> {
  isSelected: boolean;
  collapsed?: boolean;
  title: ReactNode | ((isSelected: boolean, collapsed: boolean | undefined) => ReactNode);
}
function TabLink({isSelected, title, collapsed, ...restProps}: TabLinkProps) {
  const renderedTitle = typeof title === 'function' ? title(isSelected, collapsed) : title;

  return (
    <Link {...restProps}>
      <div className={styles.container}>
        <span className={styles.visible}>{renderedTitle}</span>
        {/* hack for preserving constant tab width*/}
        <span className={styles.hidden}>{renderedTitle}</span>
        <span className={styles.hiddenBold}>{renderedTitle}</span>
        <span className={styles.hiddenRegular}>{renderedTitle}</span>
      </div>
    </Link>
  );
}

export default memo(TabLink);
