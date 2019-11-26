import React, {PureComponent} from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close.svg';

import {AdaptiveIsland} from '../island/island';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import TabTrap from '../tab-trap/tab-trap';
import Button from '../button/button';

import ScrollPreventer from './dialog__body-scroll-preventer';
import styles from './dialog.css';

/**
 * @name Dialog
 */

function noop() {}

export default class Dialog extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    show: PropTypes.bool.isRequired,
    showCloseButton: PropTypes.bool,
    onOverlayClick: PropTypes.func,
    onEscPress: PropTypes.func,
    onCloseClick: PropTypes.func,
    // onCloseAttempt is a common callback for ESC pressing and overlay clicking.
    // Use it if you don't need different behaviors for this cases.
    onCloseAttempt: PropTypes.func,
    // focusTrap may break popups inside dialog, so use it carefully
    trapFocus: PropTypes.bool,
    autoFocusFirst: PropTypes.bool
  };

  static defaultProps = {
    onOverlayClick: noop,
    onEscPress: noop,
    onCloseClick: noop,
    onCloseAttempt: noop,
    showCloseButton: false,
    trapFocus: false,
    autoFocusFirst: true
  };

  state = {
    shortcutsScope: getUID('ring-dialog-')
  };

  componentDidMount() {
    this.toggleScrollPreventer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.toggleScrollPreventer();
    }
  }

  componentWillUnmount() {
    ScrollPreventer.reset();
  }

  toggleScrollPreventer() {
    if (this.props.show) {
      ScrollPreventer.prevent();
    } else {
      ScrollPreventer.reset();
    }
  }

  handleClick = event => {
    if (event.target !== this.dialog) {
      return;
    }
    this.props.onOverlayClick(event);
    this.props.onCloseAttempt(event);
  };

  onCloseClick = event => {
    this.props.onCloseClick(event);
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

  dialogRef = tabTrap => {
    this.dialog = tabTrap && tabTrap.node;
  };

  render() {
    const {show, showCloseButton, onOverlayClick, onCloseAttempt, onEscPress, onCloseClick,
      children, className, contentClassName, trapFocus, ...restProps} = this.props;
    const classes = classNames(styles.container, className, {
      [styles.clickableOverlay]: onOverlayClick !== noop || onCloseAttempt !== noop
    });
    const shortcutsMap = this.getShortcutsMap();

    return show && createPortal(
      <TabTrap
        trapDisabled={!trapFocus}
        data-test="ring-dialog-container"
        ref={this.dialogRef}
        className={classes}
        onClick={this.handleClick}
        role="presentation"
        {...restProps}
      >
        <Shortcuts
          map={shortcutsMap}
          scope={this.state.shortcutsScope}
        />
        <div className={styles.innerContainer}>
          <AdaptiveIsland
            className={classNames(styles.content, contentClassName)}
            data-test="ring-dialog"
            role="dialog"
          >
            {children}
            {showCloseButton &&
              (
                <Button
                  icon={closeIcon}
                  data-test="ring-dialog-close-button"
                  className={styles.closeButton}
                  iconClassName={styles.closeIcon}
                  onClick={this.onCloseClick}
                  aria-label="close dialog"
                />
              )
            }
          </AdaptiveIsland>
        </div>
      </TabTrap>,
      document.body
    );
  }
}
