import React, {memo} from 'react';
import PropTypes from 'prop-types';
import chevronDown from '@jetbrains/icons/chevron-10px';
import classNames from 'classnames';

import Icon from '../icon/icon';

import Button from '../button/button';

import styles from './dropdown.css';

const Anchor = ({children, className, ...restProps}) => (
  <Button
    data-test-ring-dropdown-anchor
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

Anchor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default memo(Anchor);
