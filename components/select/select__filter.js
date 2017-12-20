import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../input/input';
import sniffr from '../global/sniffer';

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
  };

  componentDidMount() {
    setTimeout(() => this.focus());
  }

  componentWillUnmount() {
    this.blur();
  }

  focus() {
    const {input} = this;
    if (input && input !== document.activeElement) {
      sniffr.browser.name === 'firefox' ? input.select() : input.focus();
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
