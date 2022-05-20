import React, {
  Component,
  createContext,
  forwardRef,
  InputHTMLAttributes
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getUID from '../global/get-uid';

import styles from './radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string | undefined
  onChange?: ((value: string) => void) | null | undefined
}

export const RadioContext = createContext<RadioProps>({});

export class Radio extends Component<InputHTMLAttributes<HTMLInputElement>> {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
  };

  uid = getUID('ring-radio-item-');

  input?: HTMLElement | null;
  inputRef = (el: HTMLElement | null) => {
    this.input = el;
  };

  label?: HTMLElement | null;
  labelRef = (el: HTMLElement | null) => {
    this.label = el;
  };

  render() {
    const {className, children, ...restProps} = this.props;

    const classes = classNames(styles.radio, className);

    return (
      <label ref={this.labelRef} className={classes} htmlFor={this.uid}>
        <input
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

export interface RadioItemProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
}

const RadioItem = forwardRef<Radio, RadioItemProps>(function RadioItem(
  props, ref) {
  return (
    <RadioContext.Consumer>
      {({value, onChange, ...restContext}) => (
        <Radio
          ref={ref}
          {...restContext}
          checked={value != null ? value === props.value : undefined}
          onChange={onChange != null ? () => onChange(props.value) : undefined}
          {...props}
        />
      )}
    </RadioContext.Consumer>
  );
});
RadioItem.propTypes = Radio.propTypes as (typeof RadioItem)['propTypes'];
export default RadioItem;
