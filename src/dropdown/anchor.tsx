import {memo} from 'react';
import chevronDown from '@jetbrains/icons/chevron-10px';
import classNames from 'classnames';

import Icon from '../icon/icon';

import Button, {ButtonAttrs} from '../button/button';

import styles from './dropdown.css';

const Anchor = ({children, className, ...restProps}: ButtonAttrs) => (
  <Button data-test-ring-dropdown-anchor text className={classNames(styles.anchor, className)} {...restProps}>
    {children}
    <Icon glyph={chevronDown} className={styles.chevron} />
  </Button>
);

export default memo(Anchor);
