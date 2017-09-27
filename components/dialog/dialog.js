import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Portal from '@jetbrains/react-portal';
import FocusTrap from 'focus-trap-react';

import RingComponent from '../ring-component/ring-component';
import {AdaptiveIsland} from '../island/island';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';

import ScrollPreventer from './dialog__body-scroll-preventer';
import styles from './dialog.css';

function PortalPropsCleaner({children}) {
  return children;
}

/**
 * @name Dialog
 * @category Components
 * @framework React
 * @constructor
 * @description The Dialog component is a simple way to present content above an enclosing view.
 * @example-file ./dialog.examples.html
 */

export default class Dialog extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    show: PropTypes.bool.isRequired,
    onOverlayClick: PropTypes.func,
    onEscPress: PropTypes.func,
    // onCloseAttempt is a common callback for ESC pressing and overlay clicking.
    // Use it if you don't need different behaviors for this cases.
    onCloseAttempt: PropTypes.func,
    trapFocus: PropTypes.bool
  };

  static defaultProps = {
    onOverlayClick: () => {},
    onEscPress: () => {},
    onCloseAttempt: () => {},
    trapFocus: true
  };

  state = {
    shortcutsScope: getUID('ring-dialog-')
  };

  handleClick = event => {
    if (event.target !== this.dialog) {
      return;
    }
    this.props.onOverlayClick(event);
    this.props.onCloseAttempt(event);
  };

  getShortcutsMap = () => {
    const onEscape = event => {
      if (this.props.show) {
        this.props.onEscPress(event);
        this.props.onCloseAttempt(event);
      }
    };

    return {
      esc: onEscape
    };
  };

  dialogRef = focusTrap => {
    this.dialog = focusTrap && focusTrap.node;
  };

  render() {
    // eslint-disable-next-line no-unused-vars, max-len
    const {show, onOverlayClick, onCloseAttempt, onEscPress, children, className, contentClassName, trapFocus, ...restProps} = this.props;
    const classes = classNames(styles.container, className);
    const shortcutsMap = this.getShortcutsMap();

    return (
      <Portal
        isOpen={show}
        onOpen={ScrollPreventer.prevent}
        onClose={ScrollPreventer.reset}
      >
        <PortalPropsCleaner>
          <FocusTrap
            active={trapFocus}
            data-test="ring-dialog-container"
            ref={this.dialogRef}
            className={classes}
            onClick={this.handleClick}
            {...restProps}
          >
            <Shortcuts
              map={shortcutsMap}
              scope={this.state.shortcutsScope}
            />
            <AdaptiveIsland
              className={classNames(styles.content, contentClassName)}
              data-test="ring-dialog"
            >
              {children}
            </AdaptiveIsland>
          </FocusTrap>
        </PortalPropsCleaner>
      </Portal>
    );
  }
}
