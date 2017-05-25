import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../input/input';

import styles from './select.css';

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
  }

  componentDidMount() {
    setTimeout(() => this.focus());
  }

  focus() {
    if (this.input && this.input !== document.activeElement) {
      this.input.focus();
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
        {...restProps}
        borderless={true}
        inputRef={this.inputRef}
        className={classes}
      />
    );
  }
}
