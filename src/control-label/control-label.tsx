import {type LabelHTMLAttributes} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import styles from './control-label.css';

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

export const ControlLabel: React.FC<ControlLabelProps> = ({
  children,
  type = LabelType.SECONDARY,
  disabled,
  ...rest
}) => {
  // Remove when babel-plugin-react-compiler supports Babel 8
  'use no memo';
  return (
    <label
      className={classNames(styles.label, classNameByType[type], {
        [styles.disabledLabel]: disabled,
      })}
      {...rest}
    >
      {children}
    </label>
  );
};

export default ControlLabel;
