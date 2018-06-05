import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './tab-trap.css';

export const FOCUSEABLE_ELEMENTS = 'input, button:not([data-trap-button]), select, textarea, a[href], *[tabindex]';

/**
 * @name TabTrap
 * @category Components
 * @description Disallows tabbing out of a designated area.
 * @example-file ./tab-trap.examples.html
 */

export default class TabTrap extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    trapDisabled: PropTypes.bool,
    autoFocusFirst: PropTypes.bool,
    focusBackOnClose: PropTypes.bool
  };

  static defaultProps = {
    trapDisabled: false,
    autoFocusFirst: true,
    focusBackOnClose: true
  };

  constructor(...args) {
    super(...args);
    this.previousFocusedNode = document.activeElement;
  }

  componentDidMount() {
    if (this.props.autoFocusFirst) {
      this.focusFirst();
    } else {
      this.trapWithoutFocus = true;
      this.trapButtonNode.focus();
    }
  }

  componentWillUnmount() {
    this.restoreFocus();
  }

  restoreFocus() {
    if (!this.props.focusBackOnClose) {
      return;
    }
    const {previousFocusedNode} = this;
    if (previousFocusedNode && previousFocusedNode.focus) {
      previousFocusedNode.focus();
    }
  }

  containerRef = node => {
    if (!node) {
      return;
    }
    this.node = node;
  };

  focusElement = (first = true) => {
    const {node} = this;
    if (!node) {
      return;
    }

    const tabbables = [...node.querySelectorAll(FOCUSEABLE_ELEMENTS)].
      filter(item => item.tabIndex >= 0);

    const toBeFocused = first ? tabbables[0] : tabbables[tabbables.length - 1];

    if (toBeFocused) {
      toBeFocused.focus();
    }
  };

  focusFirst = () => this.focusElement(true);

  focusLast = () => this.focusElement(false);

  focusLastIfEnabled = () => {
    if (this.trapWithoutFocus) {
      return;
    }
    this.focusLast();
  };

  handleBlurIfWithoutFocus = event => {
    if (!this.trapWithoutFocus) {
      return;
    }
    this.trapWithoutFocus = false;

    const newFocused = event.nativeEvent.relatedTarget;
    if (!newFocused) {
      return;
    }

    if (this.node.contains(newFocused)) {
      return;
    }

    this.focusLast();
  };

  trapButtonRef = node => {
    if (!node) {
      return;
    }

    this.trapButtonNode = node;
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const {children, trapDisabled, autoFocusFirst, focusBackOnClose, ...restProps} = this.props;

    if (trapDisabled) {
      return (
        <div
          ref={this.containerRef}
          {...restProps}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={this.containerRef}
        {...restProps}
      >
        <button
          type="button"
          ref={this.trapButtonRef}
          className={styles.trapButton}
          onFocus={this.focusLastIfEnabled}
          onBlur={this.handleBlurIfWithoutFocus}
          data-trap-button
        />
        {children}
        <button
          type="button"
          className={styles.trapButton}
          onFocus={this.focusFirst}
          data-trap-button
        />
      </div>
    );
  }
}
