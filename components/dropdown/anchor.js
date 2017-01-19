import React, {PropTypes} from 'react';

import Icon from '../icon/icon';

import styles from './dropdown.css';
import '../link/link.scss';

import chevronDown from 'jetbrains-icons/chevron-down.svg';

export default function Anchor({children}) {
  return (
    <span className="ring-link ring-link_pseudo">
      {children}
      <Icon
        className={styles.chevron}
        glyph={chevronDown}
        size={Icon.Size.Size12}
      />
    </span>
  );
}

Anchor.propTypes = {
  children: PropTypes.node
};
