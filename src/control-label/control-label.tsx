import React, {ComponentType, LabelHTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './control-label.css';

export enum LabelType {
  SECONDARY = 'secondary',
  PRIMARY = 'primary', // See RG-2291
}

interface ControlLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  type?: LabelType;
}

export const ControlLabel: React.FC<ControlLabelProps> = (
  {children, type = LabelType.SECONDARY, disabled, ...rest}
) => (
  <label
    className={classNames(styles.label, {
      [styles.disabledLabel]: disabled,
      [styles.primaryLabel]: type === LabelType.PRIMARY
    })}
    {...rest}
  >{children}</label>
);

(ControlLabel as ComponentType<unknown>).propTypes = {
  label: PropTypes.node,
  labelStyle: PropTypes.string,
  disabled: PropTypes.bool
};


export default ControlLabel;
