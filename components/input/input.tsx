import React, {
  PureComponent,
  Ref,
  ComponentType,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
  ExoticComponent,
  PropsWithoutRef,
  RefAttributes
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close';

import Theme, {ThemeOuterProps, ThemeProps, withTheme} from '../global/theme';
import {refObject} from '../global/prop-types';
import Button from '../button/button';

import getUID from '../global/get-uid';

import Icon from '../icon/icon';

import styles from './input.css';

import composeRefs from '@jetbrains/ring-ui/components/global/composeRefs';

function noop() {}

/**
 * @name Input
 */

enum Size {
  AUTO = 'Auto',
  S = 'S',
  M = 'M',
  L = 'L',
  FULL = 'FULL'
}

export interface InputBaseProps extends ThemeProps {
  size: Size
  enableShortcuts: boolean | string[]
  renderUnderline: (underlineRef: Ref<HTMLDivElement>, errorText: ReactNode) => ReactNode
  children?: string | undefined
  inputClassName?: string | null | undefined
  label?: ReactNode
  active?: boolean | null | undefined
  compact?: boolean | null | undefined
  error?: string | null | undefined
  borderless?: boolean | null | undefined
  onClear?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | null | undefined
  loading?: boolean | null | undefined
  icon?: string | ComponentType | null | undefined
}

type Override<D, S> = Omit<D, keyof S> & S

export type InputSpecificProps = Override<InputHTMLAttributes<HTMLInputElement>, InputBaseProps> & {
  multiline?: false | undefined
  inputRef: Ref<HTMLInputElement>
}
type TextAreaSpecificProps = Override<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  InputBaseProps
> & {
  multiline: true
  inputRef: Ref<HTMLTextAreaElement>
}

export type InputProps = InputSpecificProps | TextAreaSpecificProps

export class Input extends PureComponent<InputProps> {
  static defaultProps = {
    size: Size.M,
    onChange: noop,
    inputRef: noop,
    enableShortcuts: ['esc'],
    renderUnderline: (underlineRef: Ref<HTMLDivElement>, errorText: ReactNode) => (
      <div
        className={styles.errorText}
        ref={underlineRef}
      >{errorText}</div>
    )
  };

  state = {
    empty: true
  };

  componentDidMount() {
    this.adapt();
  }

  componentDidUpdate() {
    this.adapt();
  }

  input?: HTMLInputElement | HTMLTextAreaElement | null;
  underlineNode?: HTMLElement | null;
  id = getUID('ring-input-');
  getId() {
    return this.props.id || this.id;
  }

  checkValue() {
    this.setState({
      empty: !this.input?.value
    });

    if (this.props.multiline &&
      this.input != null && this.input.scrollHeight > this.input.clientHeight) {
      this.stretch(this.input);
    }
  }

  stretch(el: HTMLElement | null | undefined) {
    if (!el || !el.style) {
      return;
    }
    el.style.height = `${el.scrollHeight}px`;
  }

  adapt() {
    this.checkValue();
    this.stretch(this.underlineNode);
  }

  underlineRef = (el: HTMLDivElement | null) => {
    this.underlineNode = el;
  };

  inputRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    this.input = el;
  };

  clear = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.onClear && this.props.onClear(e);
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.props.multiline) {
      this.props.onChange?.(e);
      this.checkValue();
    }
  };

  handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (this.props.multiline) {
      this.props.onChange?.(e);
      this.checkValue();
    }
  };

  render() {
    const {
      // Modifiers
      theme,
      size,
      active,
      multiline,
      borderless,
      compact,

      // Props
      label,
      error,
      className,
      inputClassName,
      children,
      value,
      onClear,
      disabled,
      inputRef, onChange,
      enableShortcuts,
      id,
      placeholder,
      icon,
      renderUnderline,
      ...restProps
    } = this.props;

    const minimizeMargins = compact || borderless;
    const {empty} = this.state;
    const clearable = !!onClear;
    const classes = classNames(
      styles.container,
      className,
      theme && styles[theme],
      [styles[`size${size}`]],
      {
        'ring-js-shortcuts': enableShortcuts === true,
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: empty,
        [styles.noLabel]: !this.props.label,
        [styles.withIcon]: icon != null,
        [styles.clearable]: clearable,
        [styles.compact]: minimizeMargins
      }
    );

    const inputClasses = classNames(styles.input, inputClassName);

    const text = value != null ? value : children;

    const commonProps = {
      ref: composeRefs(this.inputRef, inputRef),
      className: inputClasses,
      value: text,
      disabled,
      id: this.getId(),
      placeholder,
      'aria-label': typeof label === 'string' && label ? label : placeholder,
      'data-enabled-shortcuts': Array.isArray(enableShortcuts) ? enableShortcuts.join(',') : null
    };

    return (
      <div
        className={classes}
        data-test="ring-input"
      >
        {icon && <Icon glyph={icon} className={styles.icon}/>}
        {multiline
          ? (
            <textarea
              onChange={this.handleTextareaChange}
              rows={1}
              {...commonProps}
              {...restProps as TextareaHTMLAttributes<HTMLTextAreaElement>}
            />
          )
          : (
            <input
              onChange={this.handleInputChange}
              {...commonProps}
              {...restProps as InputHTMLAttributes<HTMLInputElement>}
            />
          )}
        {clearable && !disabled && (
          <Button
            title="Clear input"
            data-test="ring-input-clear"
            className={styles.clear}
            icon={closeIcon}
            onClick={this.clear}
          />
        )}

        {!minimizeMargins && <label htmlFor={this.getId()} className={styles.label}>{label}</label>}
        {!borderless && <div className={styles.underline}/>}
        {!borderless && <div className={styles.focusUnderline}/>}
        {!minimizeMargins && <div className={styles.errorUnderline}/>}
        {!minimizeMargins && renderUnderline(this.underlineRef, error)}
      </div>
    );
  }
}

(Input as ComponentType<unknown>).propTypes = {
  value: PropTypes.string,
  theme: PropTypes.oneOf(Object.values(Theme)).isRequired,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  size: PropTypes.oneOf(Object.values(Size)).isRequired,
  label: PropTypes.node,
  active: PropTypes.bool,
  error: PropTypes.string,
  multiline: PropTypes.bool,
  borderless: PropTypes.bool,
  compact: PropTypes.bool,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    refObject(PropTypes.instanceOf(HTMLInputElement).isRequired),
    refObject(PropTypes.instanceOf(HTMLTextAreaElement).isRequired)
  ]),
  children: PropTypes.string,
  enableShortcuts: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string.isRequired)
  ]),
  disabled: PropTypes.bool,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),

  renderUnderline: PropTypes.func
};

export type ContainerProps<P> =
  PropsWithoutRef<
    Omit<JSX.LibraryManagedAttributes<typeof Input, P>, keyof ThemeProps> & ThemeOuterProps
  > & RefAttributes<Input>


type Container =
  ExoticComponent<ContainerProps<InputSpecificProps> | ContainerProps<TextAreaSpecificProps>>

const ThemedInput: Container & {type: Container} =
  withTheme()<Input, InputProps, typeof Input>(Input);

export default ThemedInput;

export {Size, Theme};
