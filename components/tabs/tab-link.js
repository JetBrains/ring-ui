import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';

import Link from '../link/link';

import styles from './tabs.css';

function TabLink({isSelected, title, ...restProps}) {
  const renderedTitle = typeof title === 'function'
    ? title(isSelected)
    : title;

  return (
    <Link {...restProps}>
      {() => (
        <>
          <span className={styles.visible}>{renderedTitle}</span>
          {/* hack for preserving constant tab width*/}
          <span className={styles.hidden}>{renderedTitle}</span>
        </>
      )}
    </Link>
  );
}

TabLink.propTypes = {
  isSelected: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

export default pure(TabLink);
