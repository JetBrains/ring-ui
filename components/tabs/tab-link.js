import React, {memo} from 'react';
import PropTypes from 'prop-types';

import Link from '../link/link';

import styles from './tabs.css';

function TabLink({isSelected, title, collapsed, ...restProps}) {
  const renderedTitle = typeof title === 'function'
    ? title(isSelected, collapsed)
    : title;

  return (
    <Link {...restProps}>
      {() => (
        <div className={styles.container}>
          <span className={styles.visible}>{renderedTitle}</span>
          {/* hack for preserving constant tab width*/}
          <span className={styles.hidden}>{renderedTitle}</span>
          <span className={styles.hiddenBold}>{renderedTitle}</span>
          <span className={styles.hiddenRegular}>{renderedTitle}</span>
        </div>
      )}
    </Link>
  );
}

TabLink.propTypes = {
  isSelected: PropTypes.bool,
  collapsed: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.node])
};

export default memo(TabLink);
