import {type LabelHTMLAttributes} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import styles from './control-label.css';

/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export enum LabelType {
  SECONDARY = 'secondary',
  FORM = 'form', // See RG-2291
}

const classNameByType: Record<LabelType, string> = {
  [LabelType.SECONDARY]: styles.secondaryLabel,
  [LabelType.FORM]: styles.formLabel,
};

interface ControlLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  type?: LabelType;
}

/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export const ControlLabel: React.FC<ControlLabelProps> = ({
  children,
  type = LabelType.SECONDARY,
  disabled,
  ...rest
}) => (
  <label
    className={classNames(styles.label, classNameByType[type], {
      [styles.disabledLabel]: disabled,
    })}
    {...rest}
  >
    {children}
  </label>
);

export default ControlLabel;
