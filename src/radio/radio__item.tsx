import {Component, createContext, forwardRef, InputHTMLAttributes, ReactNode} from 'react';
import classNames from 'classnames';

import getUID from '../global/get-uid';

import ControlHelp from '../control-help/control-help';

import styles from './radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string | undefined;
  onChange?: ((value: string) => void) | null | undefined;
}

export const RadioContext = createContext<RadioProps>({});

export interface RadioItemInnerProps extends InputHTMLAttributes<HTMLInputElement> {
  help?: ReactNode;
}
export class RadioItemInner extends Component<RadioItemInnerProps> {
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
    const {className, children, help, ...restProps} = this.props;

    const classes = classNames(styles.radio, className);

    return (
      <label ref={this.labelRef} className={classes} htmlFor={this.uid}>
        <input id={this.uid} {...restProps} ref={this.inputRef} className={styles.input} type="radio" />
        <span className={styles.circle} />
        <span className={styles.label}>
          {children}
          {help && <ControlHelp>{help}</ControlHelp>}
        </span>
      </label>
    );
  }
}

export interface RadioItemProps extends RadioItemInnerProps {
  value: string;
}

const RadioItem = forwardRef<RadioItemInner, RadioItemProps>(function RadioItem(props, ref) {
  return (
    <RadioContext.Consumer>
      {({value, onChange, ...restContext}) => (
        <RadioItemInner
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
export default RadioItem;
