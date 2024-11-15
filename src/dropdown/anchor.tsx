import {memo} from 'react';
import classNames from 'classnames';

import Button, {ButtonAttrs} from '../button/button';

import styles from './dropdown.css';

const Anchor = ({children, className, ...restProps}: ButtonAttrs) => (
  <Button
    data-test-ring-dropdown-anchor
    inline
    dropdown
    className={classNames(styles.anchor, className)}
    {...restProps}
  >
    {children}
  </Button>
);

export default memo(Anchor);
