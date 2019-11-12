import React, {Component, createContext, forwardRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getUID from '../global/get-uid';

import styles from './radio.css';

export const RadioContext = createContext({});

export class Radio extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
  };

  uid = getUID('ring-radio-item-');

  inputRef = el => {
    this.input = el;
  };

  labelRef = el => {
    this.label = el;
  };

  render() {
    const {className, children, ...restProps} = this.props;

    const classes = classNames(styles.radio, className);

    return (
      <label ref={this.labelRef} className={classes} htmlFor={this.uid}>
        <input
          name={name}
          id={this.uid}
          {...restProps}
          ref={this.inputRef}
          className={styles.input}
          type="radio"
        />
        <span className={styles.circle}/>
        <span className={styles.label}>{children}</span>
      </label>
    );
  }
}

const RadioItem = forwardRef(function RadioItem(props, ref) {
  return (
    <RadioContext.Consumer>
      {({value, onChange, ...restContext}) => (
        <Radio
          ref={ref}
          {...restContext}
          checked={value != null ? value === props.value : undefined}
          onChange={onChange && (() => onChange(props.value))}
          {...props}
        />
      )}
    </RadioContext.Consumer>
  );
});
RadioItem.propTypes = Radio.propTypes;
export default RadioItem;
