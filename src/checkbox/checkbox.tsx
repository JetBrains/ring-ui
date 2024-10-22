import {PureComponent, InputHTMLAttributes, CSSProperties, Ref, ReactNode} from 'react';
import classNames from 'classnames';
import checkmarkIcon from '@jetbrains/icons/checkmark-12px';
import minusIcon from '@jetbrains/icons/remove-12px';

import Icon from '../icon/icon';
import {createComposedRef} from '../global/composeRefs';

import ControlHelp from '../control-help/control-help';

import styles from './checkbox.css';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | null | undefined;
  containerClassName?: string | null | undefined;
  containerStyle?: CSSProperties | undefined;
  cellClassName?: string | null | undefined;
  labelClassName?: string | null | undefined;
  indeterminate: boolean;
  inputRef?: Ref<HTMLInputElement>;
  help?: ReactNode;
}

/**
 * @name Checkbox
 */
/**
 * Displays a checkbox.
 */
export default class Checkbox extends PureComponent<CheckboxProps> {
  static defaultProps = {
    indeterminate: false,
  };

  componentDidMount() {
    if (this.input != null) {
      this.input.indeterminate = this.props.indeterminate;
    }
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    const {indeterminate} = this.props;
    if (this.input != null && indeterminate !== prevProps.indeterminate) {
      this.input.indeterminate = this.props.indeterminate;
    }
  }

  input?: HTMLInputElement | null;

  inputRef = (el: HTMLInputElement | null) => {
    if (el != null) {
      el.indeterminate = this.props.indeterminate;
    }
    this.input = el;
  };

  composedInputRef = createComposedRef<HTMLInputElement>();

  render() {
    const {
      children,
      label,
      className,
      containerClassName,
      containerStyle,
      cellClassName,
      labelClassName,
      indeterminate,
      inputRef,
      help,
      ...restProps
    } = this.props;

    const classes = classNames(styles.input, className);
    const containerClasses = classNames(styles.checkbox, containerClassName);
    const cellClasses = classNames(styles.cell, cellClassName);
    const labelClasses = classNames(styles.label, labelClassName);

    return (
      <label className={containerClasses} style={containerStyle} data-test="ring-checkbox">
        <input
          {...restProps}
          data-checked={restProps.checked}
          ref={this.composedInputRef(this.inputRef, inputRef)}
          type="checkbox"
          className={classes}
        />
        <div className={styles.cellWrapper}>
          <span className={cellClasses}>
            <Icon glyph={checkmarkIcon} className={styles.check} />
            <Icon glyph={minusIcon} className={styles.minus} />
          </span>
        </div>
        <span className={labelClasses}>
          {label || children}
          {help && <ControlHelp>{help}</ControlHelp>}
        </span>
      </label>
    );
  }
}
