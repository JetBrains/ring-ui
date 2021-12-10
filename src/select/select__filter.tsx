import React, {Component, ComponentType, RefCallback} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input, {InputAttrs} from '../input/input';
import sniffr from '../global/sniffer';
import {ActiveItemContext} from '../list/list';

import styles from './select-popup.css';

function noop() {}

type SelectFilterProps = InputAttrs & {
  inputRef: RefCallback<HTMLInputElement | HTMLTextAreaElement>
  listId?: string | undefined
}

export default class SelectFilter extends Component<SelectFilterProps> {
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

  input?: HTMLInputElement | HTMLTextAreaElement | null;
  inputRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
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

(SelectFilter as ComponentType<unknown>).propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputRef: PropTypes.func,
  listId: PropTypes.string,
  activeItemId: PropTypes.string
};
