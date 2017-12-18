import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './tab-trap.css';

const FOCUSEABLE_ELEMENTS = 'input, button:not([data-trap-button]), select, textarea, a[href], *[tabindex]';

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
    autoFocusFirst: PropTypes.bool
  };

  static defaultProps = {
    trapDisabled: false,
    autoFocusFirst: true
  };

  componentDidMount() {
    if (this.props.autoFocusFirst) {
      this.focusFirst();
    }
  }

  containerRef = node => {
    if (!node) {
      return;
    }
    this.container = node;
  };

  focusElement = (first = true) => {
    const {container} = this;
    if (!container) {
      return;
    }

    const tabbables = [...container.querySelectorAll(FOCUSEABLE_ELEMENTS)].
      filter(item => item.tabIndex >= 0);

    const toBeFocused = first ? tabbables[0] : tabbables[tabbables.length - 1];

    if (toBeFocused) {
      toBeFocused.focus();
    }
  };

  focusFirst = () => this.focusElement(true);

  focusLast = () => this.focusElement(false);

  render() {
    // eslint-disable-next-line no-unused-vars
    const {children, trapDisabled, autoFocusFirst, ...restProps} = this.props;

    if (trapDisabled) {
      return (
        <div {...restProps}>
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
          className={styles.trapButton}
          onFocus={this.focusLast}
          data-trap-button
        />
        {children}
        <button
          className={styles.trapButton}
          onFocus={this.focusFirst}
          data-trap-button
        />
      </div>
    );
  }
}
