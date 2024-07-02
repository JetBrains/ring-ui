import {Component, HTMLAttributes, ReactNode} from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';

import {isNodeInVisiblePartOfPage} from '../global/dom';

import styles from './tab-trap.css';

export const FOCUSABLE_ELEMENTS = 'input, button, select, textarea, a[href], *[tabindex]:not([data-trap-button]):not([data-scrollable-container])';

export interface TabTrapProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  trapDisabled: boolean
  autoFocusFirst: boolean
  focusBackOnClose: boolean
  focusBackOnExit: boolean
}

/**
 * @name TabTrap
 */

export default class TabTrap extends Component<TabTrapProps> {
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

  constructor(props: TabTrapProps) {
    super(props);

    // It's the same approach as in focus-trap-react:
    // https://github.com/focus-trap/focus-trap-react/commit/3b22fca9eebeb883edc89548850fe5a5b9d6d50e
    // We can't do it in componentDidMount because it's too late, some children might have already
    // focused itself.
    this.previousFocusedNode = document.activeElement;
  }

  componentDidMount() {
    if (this.props.autoFocusFirst) {
      this.focusFirst();
    } else if (!this.props.trapDisabled) {
      const previousFocusedElementIsInContainer =
        this.previousFocusedNode &&
        this.node?.contains(this.previousFocusedNode);

      // The component wrapped in TabTrap can already have a focused element (e.g. Date Picker),
      // so we need to check if it does. If so, we don't need to focus anything.
      const currentlyFocusedElementIsInContainer = this.node?.contains(document.activeElement);

      if (
        !this.node ||
        (!previousFocusedElementIsInContainer && !currentlyFocusedElementIsInContainer)
      ) {
        this.trapWithoutFocus = true;
        this.trapButtonNode?.focus();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.focusBackOnClose) {
      this.restoreFocus();
    }
  }

  previousFocusedNode?: Element | null;
  trapWithoutFocus?: boolean;

  restoreFocus = () => {
    const {previousFocusedNode} = this;
    if (
      previousFocusedNode instanceof HTMLElement &&
      previousFocusedNode.focus &&
      isNodeInVisiblePartOfPage(previousFocusedNode)
    ) {
      previousFocusedNode.focus({preventScroll: true});
    }
  };

  node?: HTMLElement | null;
  containerRef = (node: HTMLElement | null) => {
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

    const tabables = [...node.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)].
      filter(item => item.tabIndex >= 0);

    const toBeFocused = first ? tabables[0] : tabables[tabables.length - 1];

    if (toBeFocused) {
      toBeFocused.focus();
    }
  };

  focusFirst = () => this.focusElement(true);

  focusLast = () => this.focusElement(false);

  focusLastIfEnabled = (event: React.FocusEvent) => {
    if (this.trapWithoutFocus) {
      return;
    }
    if (this.props.focusBackOnExit) {
      const prevFocused = event.nativeEvent.relatedTarget;
      if (prevFocused != null && this.node != null && prevFocused instanceof Element &&
        this.node.contains(prevFocused)) {
        this.restoreFocus();
      }
    } else {
      this.focusLast();
    }
  };

  handleBlurIfWithoutFocus = (event: React.FocusEvent) => {
    if (!this.trapWithoutFocus) {
      return;
    }
    this.trapWithoutFocus = false;

    const newFocused = event.nativeEvent.relatedTarget;
    if (!newFocused) {
      return;
    }

    if (newFocused instanceof Element && this.node?.contains(newFocused)) {
      return;
    }

    this.focusLast();
  };

  trapButtonNode?: HTMLElement | null;
  trapButtonRef = (node: HTMLElement | null) => {
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
