import {createRef, PureComponent} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close';

import {AdaptiveIsland} from '../island/island';
import getUID from '../global/get-uid';
import dataTests from '../global/data-tests';
import Shortcuts from '../shortcuts/shortcuts';
import TabTrap, {type TabTrapProps} from '../tab-trap/tab-trap';
import Button from '../button/button';
import {PopupTarget, PopupTargetContext} from '../popup/popup.target';
import {getPopupContainer} from '../popup/popup';
import {preventerFactory as scrollPreventerFactory} from './dialog-body-scroll-preventer';
import styles from './dialog.css';

import type {ShortcutsScopeOptions} from '../shortcuts/core';

export interface DialogProps extends Partial<TabTrapProps> {
  show: boolean;
  label: string;
  onOverlayClick: (event: React.MouseEvent<HTMLElement>) => void;
  onEscPress: (event: KeyboardEvent) => void;
  onCloseClick: (event: React.MouseEvent<HTMLElement>) => void;
  // onCloseAttempt is a common callback for ESC pressing and overlay clicking.
  // Use it if you don't need different behaviors for this cases.
  onCloseAttempt: (event: React.MouseEvent<HTMLElement> | KeyboardEvent) => void;
  showCloseButton: boolean;
  shortcutOptions: ShortcutsScopeOptions;
  closeButtonInside: boolean; // TODO make it always true in 8.0
  closeButtonTitle?: string;
  // focusTrap may break popups inside dialog, so use it carefully
  trapFocus: boolean;
  contentClassName?: string | null | undefined;
  portalTarget?: Element | null | undefined;
  'data-test'?: string | null | undefined;
  dense?: boolean | null | undefined;
  native?: boolean;
  modal?: boolean;
  preventBodyScroll?: boolean;
}

/**
 * @name Dialog
 */

function noop() {}

export default class Dialog extends PureComponent<DialogProps> {
  static defaultProps: Partial<DialogProps> = {
    label: 'Dialog',
    onOverlayClick: noop,
    onEscPress: noop,
    onCloseClick: noop,
    onCloseAttempt: noop,
    showCloseButton: false,
    closeButtonInside: false,
    shortcutOptions: {modal: false},
    trapFocus: false,
    autoFocusFirst: true,
    modal: true,
    preventBodyScroll: true,
  };

  state = {
    shortcutsScope: getUID('ring-dialog-'),
  };

  componentDidMount() {
    const {show, native} = this.props;
    if (native && show) {
      this.toggleNativeDialog();
    }
    this.toggleScrollPreventer();
  }

  componentDidUpdate(prevProps: DialogProps) {
    const {show, native} = this.props;
    if (native && show !== prevProps.show) {
      this.toggleNativeDialog();
    }
    if (prevProps.show !== this.props.show) {
      this.toggleScrollPreventer();
    }
  }

  componentWillUnmount() {
    this.scrollPreventer.reset();
  }

  scrollPreventer = scrollPreventerFactory(getUID('preventer-'));

  uid = getUID('dialog-');

  toggleNativeDialog() {
    const {show, modal} = this.props;
    if (this.nativeDialog.current) {
      if (show) {
        this.nativeDialog.current.removeAttribute('open');
        if (modal) {
          this.nativeDialog.current.showModal();
        } else {
          this.nativeDialog.current.show();
        }
      } else {
        this.nativeDialog.current.close();
      }
    }
  }

  toggleScrollPreventer() {
    if (!this.props.preventBodyScroll) {
      return;
    }
    if (this.props.show) {
      this.scrollPreventer.prevent();
    } else {
      this.scrollPreventer.reset();
    }
  }

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onOverlayClick(event);
    this.props.onCloseAttempt(event);
  };

  onCloseClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onCloseClick(event);
    this.props.onCloseAttempt(event);
  };

  getShortcutsMap = () => {
    const onEscape = (event: KeyboardEvent) => {
      if (this.props.show) {
        this.props.onEscPress(event);
        this.props.onCloseAttempt(event);
      }
    };

    return {
      esc: onEscape,
    };
  };

  dialog?: HTMLElement | null;
  dialogRef = (tabTrap: TabTrap | null) => {
    this.dialog = tabTrap && tabTrap.node;
  };

  nativeDialog = createRef<HTMLDialogElement>();

  render() {
    const {
      show,
      showCloseButton,
      onOverlayClick,
      onCloseAttempt,
      onEscPress,
      onCloseClick,
      children,
      className,
      contentClassName,
      trapFocus,
      'data-test': dataTest,
      closeButtonInside,
      portalTarget,
      label,
      closeButtonTitle,
      dense,
      shortcutOptions,
      native,
      modal,
      preventBodyScroll,
      ...restProps
    } = this.props;
    const classes = classNames(styles.container, className);
    const shortcutsMap = this.getShortcutsMap();
    const content = (
      <>
        <Shortcuts map={shortcutsMap} scope={this.state.shortcutsScope} options={this.props.shortcutOptions} />
        {(onOverlayClick !== noop || onCloseAttempt !== noop) && (
          <div
            // click handler is duplicated in close button
            role='presentation'
            className={styles.clickableOverlay}
            onClick={this.handleClick}
            data-test='ring-dialog-overlay'
          />
        )}
        <div className={styles.innerContainer}>
          <AdaptiveIsland
            className={classNames(styles.content, contentClassName, {
              [styles.dense]: dense,
            })}
            data-test='ring-dialog'
            role='dialog'
            aria-label={label}
          >
            {children}
            {showCloseButton && (
              <Button
                icon={closeIcon}
                data-test='ring-dialog-close-button'
                className={classNames(styles.closeButton, {
                  [styles.closeButtonOutside]: !closeButtonInside,
                  [styles.closeButtonInside]: closeButtonInside,
                })}
                iconClassName={classNames(styles.closeIcon, {
                  [styles.closeIconOutside]: !closeButtonInside,
                  [styles.closeIconInside]: closeButtonInside,
                })}
                onClick={this.onCloseClick}
                title={closeButtonTitle}
                aria-label={closeButtonTitle || 'close dialog'}
              />
            )}
          </AdaptiveIsland>
        </div>
      </>
    );

    if (native) {
      return (
        <dialog
          className={classNames(styles.nativeDialog, className)}
          ref={this.nativeDialog}
          data-rg-modal-dialog-container={modal ? '' : undefined}
        >
          <PopupTarget id={this.uid} className={styles.popupTarget}>
            {target => (
              <>
                {content}
                {target}
              </>
            )}
          </PopupTarget>
        </dialog>
      );
    }

    return (
      show && (
        <PopupTargetContext.Consumer>
          {contextTarget => {
            let targetElement: Element = document.body;
            if (portalTarget instanceof HTMLElement) {
              targetElement = portalTarget;
            } else if (contextTarget) {
              const container = getPopupContainer(contextTarget);
              if (container) {
                targetElement = container;
              }
            }
            return createPortal(
              <PopupTarget id={this.uid} className={styles.popupTarget}>
                {target => (
                  <TabTrap
                    trapDisabled={!trapFocus}
                    data-test={dataTests('ring-dialog-container', dataTest)}
                    data-rg-modal-dialog-container=''
                    ref={this.dialogRef}
                    className={classes}
                    role='presentation'
                    {...restProps}
                  >
                    {content}
                    {target}
                  </TabTrap>
                )}
              </PopupTarget>,
              targetElement,
            );
          }}
        </PopupTargetContext.Consumer>
      )
    );
  }
}

export type DialogAttrs = React.JSX.LibraryManagedAttributes<typeof Dialog, DialogProps>;
