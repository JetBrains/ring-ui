import React from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button';
import Icon from '../icon/icon';

import styles from './dropdown.css';

import chevronDown from 'jetbrains-icons/chevron-down.svg';

export default function Anchor({children}) {
  return (
    <Button
      text={true}
      className={styles.anchor}
    >
      {children}
      <Icon
        className={styles.chevron}
        glyph={chevronDown}
        size={Icon.Size.Size12}
      />
    </Button>
  );
}

Anchor.propTypes = {
  children: PropTypes.node
};
