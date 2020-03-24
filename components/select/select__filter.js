import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../input/input';
import sniffr from '../global/sniffer';
import {ActiveItemContext} from '../list/list';

import styles from './select-popup.css';

function noop() {}

export default class SelectFilter extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputRef: PropTypes.func,
    listId: PropTypes.string,
    activeItemId: PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Filter items',
    inputRef: noop
  };

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
    const {className, listId, ...restProps} = this.props;
    const classes = classNames(styles.filter, className);

    return (
      <ActiveItemContext.ValueContext.Consumer>
        {activeItemId => (
          <Input
            {...restProps}
            aria-owns={listId}
            aria-activedescendant={activeItemId}
            autoComplete="off"
            autoFocus
            borderless
            inputRef={this.inputRef}
            className={classes}
          />
        )}
      </ActiveItemContext.ValueContext.Consumer>
    );
  }
}
