import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';
import Theme from '../global/theme';

import styles from './input.css';

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
    children: PropTypes.string
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    size: Size.M,
    onChange() {}
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
  };

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
      ...restProps
    } = this.props;
    const classes = classNames(
      styles.container,
      className,
      styles[theme],
      [styles[`size${size}`]],
      {
        [styles.active]: active,
        [styles.error]: error != null,
        [styles.empty]: this.state.empty,
        [styles.noLabel]: !this.props.label
      }
    );

    const TagName = multiline ? 'textarea' : 'input';

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
          value={value != null ? value : children}
          rows={multiline ? 1 : null}
          {...restProps}
        />
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

