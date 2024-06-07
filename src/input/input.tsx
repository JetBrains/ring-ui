import React, {
  PureComponent,
  Ref,
  ComponentType,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close-12px';

import {refObject} from '../global/prop-types';
import Button from '../button/button';

import getUID from '../global/get-uid';

import Icon from '../icon/icon';
import {I18nContext} from '../i18n/i18n-context';

import composeRefs from '../global/composeRefs';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';
import {ControlLabel, LabelType} from '../control-label/control-label';

import styles from './input.css';


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

export interface InputTranslations {
  clear: string
}

export interface InputBaseProps {
  size: Size
  enableShortcuts: boolean | string[]
  children?: string | undefined
  inputClassName?: string | null | undefined
  label?: ReactNode
  labelType?: LabelType
  active?: boolean | null | undefined
  error?: ReactNode | null | undefined
  help?: ReactNode | null | undefined
  borderless?: boolean | null | undefined
  onClear?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | null | undefined
  icon?: string | ComponentType | null | undefined
  height?: ControlsHeight | undefined
  afterInput?: ReactNode
  translations?: InputTranslations | null | undefined
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
    enableShortcuts: ['esc']
  };

  state = {
    empty: true
  };

  componentDidMount() {
    this.frame = requestAnimationFrame(() => this.adapt());
  }

  componentDidUpdate() {
    this.adapt();
  }

  componentWillUnmount() {
    if (this.frame != null) {
      cancelAnimationFrame(this.frame);
    }
  }

  static contextType = ControlsHeightContext;
  frame?: number;
  input?: HTMLInputElement | HTMLTextAreaElement | null;
  id = getUID('ring-input-');
  getId() {
    return this.props.id || this.id;
  }

  checkValue() {
    this.setState({
      empty: !this.input?.value
    });

    if (this.props.multiline &&
      this.input != null && this.input.scrollHeight >= this.input.clientHeight) {
      this.stretch(this.input);
    }
  }

  stretch(el: HTMLElement | null | undefined) {
    if (!el || !el.style) {
      return;
    }
    el.style.height = '0'; // To know the real scrollHeight
    el.style.height = `${el.scrollHeight + 2}px`;
  }

  adapt() {
    this.checkValue();
  }

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
      size,
      active,
      multiline,
      borderless,

      // Props
      label,
      labelType,
      error,
      help,
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
      translations,
      height = this.context,
      afterInput,
      ...restProps
    } = this.props;

    const {empty} = this.state;
    const clearable = !!onClear;
    const classes = classNames(
      className,
      styles.outerContainer,
      [styles[`size${size}`]],
      [styles[`height${height}`]],
      {
        'ring-js-shortcuts': enableShortcuts === true,
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: empty,
        [styles.withIcon]: icon != null,
        [styles.clearable]: clearable,
        [styles.borderless]: borderless
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
      <I18nContext.Consumer>
        {({translate}) => (
          <div className={classes} data-test="ring-input">
            {label && (
              <ControlLabel
                htmlFor={this.getId()}
                disabled={disabled}
                type={labelType}
              >{label}</ControlLabel>
            )}
            <div className={styles.container}>
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
                  title={translations?.clear ?? translate('clear')}
                  data-test="ring-input-clear"
                  className={styles.clear}
                  icon={closeIcon}
                  onClick={this.clear}
                />
              )}
              {afterInput}
            </div>
            {error
              ? <div className={styles.errorText}>{error}</div>
              : (help && <div className={styles.helpText}>{help}</div>)}
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}

(Input as ComponentType<unknown>).propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  size: PropTypes.oneOf(Object.values(Size)).isRequired,
  label: PropTypes.node,
  active: PropTypes.bool,
  error: PropTypes.string,
  multiline: PropTypes.bool,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    refObject(PropTypes.instanceOf(HTMLInputElement)),
    refObject(PropTypes.instanceOf(HTMLTextAreaElement))
  ]),
  children: PropTypes.string,
  enableShortcuts: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string.isRequired)
  ]),
  disabled: PropTypes.bool,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  translations: PropTypes.object,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
};

export type ContainerProps<P extends InputProps> = JSX.LibraryManagedAttributes<typeof Input, P>

export type InputSpecificAttrs = ContainerProps<InputSpecificProps>;
export type TextAreaSpecificAttrs = ContainerProps<TextAreaSpecificProps>;
export type InputAttrs = InputSpecificAttrs | TextAreaSpecificAttrs;

export default Input;

export {Size};
