import {createRef, PureComponent} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';
import classNames from 'classnames';

import {AdaptiveIsland} from '../island/island';
import getUID from '../global/get-uid';
import dataTests from '../global/data-tests';
import Shortcuts from '../shortcuts/shortcuts';
import TabTrap, {type TabTrapObject, type TabTrapProps} from '../tab-trap/tab-trap';
import {normalizePopupTarget, PopupTarget, PopupTargetContext} from '../popup/popup.target';
import {getPopupContainer} from '../popup/popup';
import {preventerFactory as scrollPreventerFactory} from './dialog-body-scroll-preventer';
import DialogControls from './dialog-controls';
import {
  fitGeometry,
  getNativeTabIndex,
  getResizeMinimum,
  getTrapDisabled,
  getViewportSize,
  moveGeometry,
  resizeGeometry,
  type DialogState,
  type Interaction,
  type InteractionDirection,
} from './dialog-geometry';

import type {ShortcutsScopeOptions} from '../shortcuts/core';

import styles from './dialog.css';

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
  closeButtonTitle?: string;
  movable?: boolean;
  resizable?: boolean;
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

/** @name Dialog */
function noop() {}

export default class Dialog extends PureComponent<DialogProps, DialogState> {
  static defaultProps: Partial<DialogProps> = {
    label: 'Dialog',
    onOverlayClick: noop,
    onEscPress: noop,
    onCloseClick: noop,
    onCloseAttempt: noop,
    showCloseButton: false,
    movable: true,
    resizable: true,
    shortcutOptions: {modal: false},
    trapFocus: false,
    autoFocusFirst: true,
    native: true,
    modal: true,
    preventBodyScroll: true,
  };

  state: DialogState = {shortcutsScope: getUID('ring-dialog-'), geometry: null, resized: false};

  componentDidMount() {
    const {show, native} = this.props;
    if (native && show) {
      this.toggleNativeDialog();
    }
    window.addEventListener('resize', this.fitGeometryToViewport);
    this.toggleScrollPreventer();
  }

  componentDidUpdate(prevProps: DialogProps) {
    const {show, native} = this.props;
    if (native && show !== prevProps.show) {
      this.toggleNativeDialog();
    }
    if (prevProps.show !== this.props.show) {
      this.toggleScrollPreventer();
      if (show) {
        this.fitGeometryToViewport();
      } else {
        this.interaction = null;
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.fitGeometryToViewport);
    this.interaction = null;
    this.scrollPreventer.reset();
  }

  scrollPreventer = scrollPreventerFactory(getUID('preventer-'));

  uid = getUID('dialog-');

  toggleNativeDialog() {
    const {show, modal, autoFocusFirst} = this.props;
    if (this.nativeDialog.current) {
      if (show) {
        this.nativeDialog.current.removeAttribute('open');
        if (modal) {
          this.nativeDialog.current.showModal();
        } else {
          this.nativeDialog.current.show();
        }
        if (!autoFocusFirst && !this.nativeDialog.current.querySelector('[autofocus]')) {
          this.nativeDialog.current.focus();
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
  dialogRef = (tabTrapObj: TabTrapObject | null) => {
    this.dialog = tabTrapObj && tabTrapObj.node;
  };

  nativeDialog = createRef<HTMLDialogElement>();
  innerContainer = createRef<HTMLDivElement>();
  interaction: Interaction | null = null;

  fitGeometryToViewport = () => {
    this.setState(({geometry}) => {
      if (!geometry) {
        return null;
      }
      const {width, height} = getViewportSize();
      return {geometry: fitGeometry(geometry, width, height)};
    });
  };

  startInteraction = (event: React.PointerEvent<HTMLElement>, direction: InteractionDirection) => {
    if ((event.button ?? 0) !== 0 || !this.innerContainer.current) {
      return;
    }
    const {left, top, width, height} = this.innerContainer.current.getBoundingClientRect();
    this.interaction = {
      pointerId: event.pointerId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      ...getResizeMinimum(this.innerContainer.current.firstElementChild!),
      geometry: {left, top, width, height},
    };
    this.setState(({resized}) => ({geometry: {left, top, width, height}, resized: resized || direction !== 'move'}));
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  continueInteraction = (event: React.PointerEvent<HTMLElement>) => {
    const interaction = this.interaction;
    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - interaction.startX;
    const dy = event.clientY - interaction.startY;
    const {width: viewportWidth, height: viewportHeight} = getViewportSize();
    const start = interaction.geometry;

    if (interaction.direction === 'move') {
      this.setState({geometry: moveGeometry(start, dx, dy, viewportWidth, viewportHeight)});
      return;
    }

    this.setState({
      geometry: resizeGeometry(interaction, dx, dy, viewportWidth, viewportHeight),
      resized: true,
    });
  };

  stopInteraction = (event: React.PointerEvent<HTMLElement>) => {
    if (this.interaction?.pointerId !== event.pointerId) {
      return;
    }
    this.interaction = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  startMove = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target;
    if (!this.props.movable || !(target instanceof Element)) {
      return;
    }
    const handle = target.closest('[data-ring-dialog-move-handle], [data-ring-island-header]');
    if (handle?.parentElement === event.currentTarget) {
      this.startInteraction(event, 'move');
    }
  };

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
      portalTarget,
      label,
      closeButtonTitle,
      dense,
      shortcutOptions,
      native,
      modal,
      preventBodyScroll,
      movable,
      resizable,
      autoFocusFirst,
      focusBackOnClose,
      focusBackOnExit,
      trapDisabled,
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
        <div
          ref={this.innerContainer}
          data-test='ring-dialog-inner-container'
          className={classNames(styles.innerContainer, {[styles.resized]: this.state.resized})}
          style={
            this.state.geometry
              ? {
                  position: 'fixed',
                  left: this.state.geometry.left,
                  top: this.state.geometry.top,
                  width: this.state.resized ? this.state.geometry.width : undefined,
                  height: this.state.resized ? this.state.geometry.height : undefined,
                }
              : undefined
          }
        >
          <AdaptiveIsland
            className={classNames(styles.content, contentClassName, {
              [styles.dense]: dense,
              [styles.movable]: movable,
            })}
            data-test='ring-dialog'
            role={native ? undefined : 'dialog'}
            aria-label={native ? undefined : label}
            onPointerDown={this.startMove}
            onPointerMove={this.continueInteraction}
            onPointerUp={this.stopInteraction}
            onPointerCancel={this.stopInteraction}
          >
            {children}
            <DialogControls
              movable={movable}
              resizable={resizable}
              showCloseButton={showCloseButton}
              closeButtonTitle={closeButtonTitle}
              onCloseClick={this.onCloseClick}
              onStartInteraction={this.startInteraction}
              onStopInteraction={this.stopInteraction}
            />
          </AdaptiveIsland>
        </div>
      </>
    );

    if (native) {
      return createPortal(
        <dialog
          {...restProps}
          aria-label={label}
          className={classNames(styles.nativeDialog, className)}
          data-test={dataTests('ring-dialog-container', dataTest)}
          ref={this.nativeDialog}
          tabIndex={getNativeTabIndex(autoFocusFirst)}
          onCancel={event => event.preventDefault()}
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
        </dialog>,
        document.body,
      );
    }

    return (
      show && (
        <PopupTargetContext.Consumer>
          {contextTarget => {
            const normalizedContextTarget = normalizePopupTarget(contextTarget);
            let targetElement: Element = document.body;
            if (portalTarget instanceof HTMLElement) {
              targetElement = portalTarget;
            } else if (normalizedContextTarget !== undefined) {
              const container = getPopupContainer(normalizedContextTarget);
              if (container) {
                targetElement = container;
              }
            }
            return createPortal(
              <PopupTarget id={this.uid} className={styles.popupTarget}>
                {target => (
                  <TabTrap
                    trapDisabled={getTrapDisabled(trapFocus, trapDisabled)}
                    autoFocusFirst={autoFocusFirst}
                    focusBackOnClose={focusBackOnClose}
                    focusBackOnExit={focusBackOnExit}
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
