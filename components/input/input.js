import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';
import Theme from '../global/theme';

import Button from '../button/button';

import clearIcon from 'jetbrains-icons/close.svg';

import styles from './input.css';

function noop() {}

/**
 * @name Input
 * @category Components
 * @tags 3.0
 * @framework React
 * @constructor
 * @description Text input fields of varying size.
 * @example-file ./input.examples.html
 */

const Size = {
  S: 'S',
  M: 'M',
  L: 'L'
};

export default class Input extends PureComponent {
  static Size = Size;
  static Theme = Theme;

  static propTypes = {
    value: PropTypes.string,
    theme: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.string,
    label: PropTypes.string,
    active: PropTypes.bool,
    error: PropTypes.string,
    multiline: PropTypes.bool,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    inputRef: PropTypes.func,
    children: PropTypes.string
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    size: Size.M,
    onChange: noop,
    onClear: noop,
    inputRef: noop
  };

  state = {
    empty: true
  };

  checkValue() {
    this.setState({
      empty: !this.input.value
    });

    if (this.props.multiline && this.input.scrollHeight > this.input.clientHeight) {
      this.stretch(this.input);
    }
  }

  stretch(el) {
    el.style.height = `${el.scrollHeight}px`;
  }

  adapt() {
    this.checkValue();
    this.stretch(this.error);
  }

  componentDidMount() {
    this.adapt();
  }

  componentDidUpdate() {
    this.adapt();
  }

  errorRef = el => {
    this.error = el;
  };

  inputRef = el => {
    this.input = el;
    this.props.inputRef(el);
  };

  clear = e => {
    this.props.onClear(e);
  }

  render() {
    const {
      // Modifiers
      theme,
      size,
      active,
      multiline,

      // Props
      label,
      error,
      className,
      children,
      value,
      onChange,
      onClear,
      inputRef, // eslint-disable-line no-unused-vars
      ...restProps
    } = this.props;
    const {empty} = this.state;
    const clearable = onClear !== noop && !empty;
    const classes = classNames(
      styles.container,
      className,
      styles[theme],
      [styles[`size${size}`]],
      {
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: empty,
        [styles.noLabel]: !this.props.label,
        [styles.clearable]: clearable
      }
    );

    const TagName = multiline ? 'textarea' : 'input';

    const text = value != null ? value : children;

    return (
      <div
        className={classes}
        data-test="ring-input"
      >
        <TagName
          ref={this.inputRef}
          onChange={e => {
            onChange(e);
            this.checkValue(e.target);
          }}
          className={styles.input}
          value={text}
          rows={multiline ? 1 : null}
          {...restProps}
        />
        {clearable && (
          <Button
            className={styles.clear}
            icon={clearIcon}
            iconSize={Button.IconSize.Size14}
            onClick={this.clear}
          />
        )}
        <label className={styles.label}>{label}</label>
        <div className={styles.underline} />
        <div className={styles.focusUnderline} />
        <div className={styles.errorUnderline} />
        <div
          className={styles.errorText}
          ref={this.errorRef}
        >{error}</div>
      </div>
    );
  }
}

