import React from 'react';
import PropTypes from 'prop-types';
import chevronDown from '@jetbrains/icons/chevron-10px.svg';
import classNames from 'classnames';

import Icon from '../icon';

import Button from '../button/button';

import styles from './dropdown.css';

export default function Anchor({children, className, ...restProps}) {
  return (
    <Button
      text
      className={classNames(styles.anchor, className)}
      {...restProps}
    >
      {children}
      <Icon
        glyph={chevronDown}
        className={styles.chevron}
      />
    </Button>
  );
}

Anchor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
