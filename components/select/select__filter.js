import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../input/input';

import styles from './select-popup.css';

function noop() {}

export default class SelectFilter extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputRef: PropTypes.func
  };

  static defaultProps = {
    placeholder: 'Filter items',
    inputRef: noop
  };

  componentWillUnmount() {
    this.blur();
  }

  focus() {
    if (this.input && this.input !== document.activeElement) {
      this.input.focus();
    }
  }

  blur() {
    if (this.input && this.input === document.activeElement) {
      this.input.blur();
    }
  }

  inputRef = el => {
    this.input = el;
    this.props.inputRef(el);
  };

  render() {
    const {className, ...restProps} = this.props;
    const classes = classNames(styles.filter, className);

    return (
      <Input
        autoFocus
        {...restProps}
        borderless
        inputRef={this.inputRef}
        className={classes}
      />
    );
  }
}
