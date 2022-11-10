import React, {ComponentType, PureComponent, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './input.css';

interface InputLabelProps {
  htmlFor?: string;
  disabled?: boolean;
  label: ReactNode;
}

export class InputLabel extends PureComponent<InputLabelProps> {
  render() {
    const {htmlFor, label, disabled} = this.props;

    return (
      <label
        htmlFor={htmlFor}
        className={classNames(styles.label, {
          [styles.disabledLabel]: disabled
        })}
      >{label}</label>
    );
  }
}

(InputLabel as ComponentType<unknown>).propTypes = {
  label: PropTypes.node,
  disabled: PropTypes.bool,
  id: PropTypes.string
};


export default InputLabel;
