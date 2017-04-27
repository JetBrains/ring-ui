import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../input/input';

function noop() {}

export default class SelectFilter extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputRef: PropTypes.func
  };

  static defaultProps = {
    placeholder: '',
    inputRef: noop
  }

  componentDidMount() {
    this.focus();
  }

  componentDidUpdate() {
    this.focus();
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
    const classes = classNames('ring-input_filter-popup', className);

    return (
      <Input
        {...restProps}
        inputRef={this.inputRef}
        className={classes}
      />
    );
  }
}
