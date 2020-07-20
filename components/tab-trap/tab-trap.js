import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {isNodeInVisiblePartOfPage} from '../global/dom';

import styles from './tab-trap.css';

export const FOCUSABLE_ELEMENTS = 'input, button, select, textarea, a[href], *[tabindex]:not([data-trap-button]):not([data-scrollable-container])';

/**
 * @name TabTrap
 */

export default class TabTrap extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    trapDisabled: PropTypes.bool,
    autoFocusFirst: PropTypes.bool,
    focusBackOnClose: PropTypes.bool,
    focusBackOnExit: PropTypes.bool
  };

  static defaultProps = {
    trapDisabled: false,
    autoFocusFirst: true,
    focusBackOnClose: true,
    focusBackOnExit: false
  };

  componentDidMount() {
    this.previousFocusedNode = document.activeElement;

    if (this.props.autoFocusFirst) {
      this.focusFirst();
    } else if (
      !this.props.trapDisabled &&
      (!this.node || !this.node.contains(this.previousFocusedNode))
    ) {
      this.trapWithoutFocus = true;
      this.trapButtonNode.focus();
    }
  }

  componentWillUnmount() {
    if (this.props.focusBackOnClose) {
      this.restoreFocus();
    }
  }

  restoreFocus = () => {
    const {previousFocusedNode} = this;
    if (
      previousFocusedNode &&
      previousFocusedNode.focus &&
      isNodeInVisiblePartOfPage(previousFocusedNode)
    ) {
      previousFocusedNode.focus();
    }
  };

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

    const tabables = [...node.querySelectorAll(FOCUSABLE_ELEMENTS)].
      filter(item => item.tabIndex >= 0);

    const toBeFocused = first ? tabables[0] : tabables[tabables.length - 1];

    if (toBeFocused) {
      toBeFocused.focus();
    }
  };

  focusFirst = () => this.focusElement(true);

  focusLast = () => this.focusElement(false);

  focusLastIfEnabled = event => {
    if (this.trapWithoutFocus) {
      return;
    }
    if (this.props.focusBackOnExit) {
      const prevFocused = event.nativeEvent.relatedTarget;
      if (prevFocused != null && this.node != null && this.node.contains(prevFocused)) {
        this.restoreFocus();
      }
    } else {
      this.focusLast();
    }
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
    const {
      children,
      trapDisabled,
      autoFocusFirst,
      focusBackOnClose,
      focusBackOnExit,
      ...restProps
    } = this.props;

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
        <div
          // It never actually stays focused
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          ref={this.trapButtonRef}
          className={styles.trapButton}
          onFocus={this.focusLastIfEnabled}
          onBlur={this.handleBlurIfWithoutFocus}
          data-trap-button
        />
        {children}
        <div
          // It never actually stays focused
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          onFocus={focusBackOnExit ? this.restoreFocus : this.focusFirst}
          data-trap-button
        />
      </div>
    );
  }
}
