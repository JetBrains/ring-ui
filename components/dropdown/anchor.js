import React from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@jetbrains/icons/chevron-down.svg';

import styles from './dropdown.css';
import '../link/link.scss';

export default function Anchor({children}) {
  return (
    <span className="ring-link ring-link_pseudo">
      {children}
      <ChevronDownIcon
        className={styles.chevron}
        size={ChevronDownIcon.Size.Size12}
      />
    </span>
  );
}

Anchor.propTypes = {
  children: PropTypes.node
};
