import {PureComponent, type ReactNode} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import exceptionIcon from '@jetbrains/icons/exception';
import successIcon from '@jetbrains/icons/success';
import warningIcon from '@jetbrains/icons/warning';
import infoIcon from '@jetbrains/icons/info-filled';
import closeIcon from '@jetbrains/icons/close';

import Icon from '../icon/icon';
import Loader from '../loader-inline/loader-inline';
import {getRect} from '../global/dom';
import dataTests from '../global/data-tests';
import Button from '../button/button';
import Theme, {ThemeProvider} from '../global/theme';
import AlertHeading from './alert-heading';
import AlertActions from './alert-actions';

import styles from './alert.css';

export const ANIMATION_TIME = 500;

/**
 * @name Alert
 */

/**
 * List of available alert types.
 * @enum {string}
 */
export enum AlertType {
  ERROR = 'error',
  MESSAGE = 'message',
  SUCCESS = 'success',
  WARNING = 'warning',
  LOADING = 'loading',
  INFO = 'info',
}

/**
 * Lookup table of alert type to icon modifier.
 * @type {Object.<AlertType, string>}
 */
const TypeToIcon: Partial<Record<AlertType, string>> = {
  [AlertType.ERROR]: exceptionIcon,
  [AlertType.SUCCESS]: successIcon,
  [AlertType.WARNING]: warningIcon,
  [AlertType.INFO]: infoIcon,
};

/**
 * Maps the values React renders as nothing (except empty arrays/fragments,
 * which are not worth chasing here) to undefined, so that they neither create
 * the afterMessage wrapper nor distinguish alerts in the alert-service
 * duplicate check
 */
export function normalizeAfterMessage(afterMessage: ReactNode): ReactNode {
  return afterMessage == null || typeof afterMessage === 'boolean' || afterMessage === '' ? undefined : afterMessage;
}

export interface AlertProps {
  theme: Theme;
  timeout: number;
  /**
   * Fires when alert starts closing if timeout is out or user clicks "Close" button
   */
  onCloseRequest: (event?: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  isShaking: boolean;
  isClosing: boolean;
  /**
   * Whether an alert is rendered inside an **Alerts** container
   * or standalone.
   */
  inline: boolean;
  showWithAnimation: boolean;
  closeable: boolean;
  type: AlertType;
  children?: ReactNode;
  className?: string | null | undefined;
  captionClassName?: string | null | undefined;
  closeButtonClassName?: string | null | undefined;
  'data-test'?: string | null | undefined;
  afterMessage?: ReactNode;
}

interface State {
  height: number | null;
}

/**
 * @constructor
 * @name Alert
 * @extends {ReactComponent}
 */
/**
 * **Alert** is a component for displaying contextual notifications. If you want to display a stack of notifications, use **Alerts** instead.
 */
export default class Alert extends PureComponent<AlertProps, State> {
  /** @override */
  static defaultProps = {
    theme: Theme.DARK,
    closeable: true,
    showWithAnimation: true,
    type: AlertType.MESSAGE,
    inline: true,
    isClosing: false,
    isShaking: false,
    timeout: 0,
    onClose: () => {},
    onCloseRequest: () => {},
  };

  state = {
    height: null,
  };

  componentDidMount() {
    if (this.props.timeout > 0) {
      this.hideTimeout = window.setTimeout(this.closeRequest, this.props.timeout);
    }
  }

  componentDidUpdate() {
    if (this.props.isClosing) {
      this._close();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  node?: HTMLDivElement | null;
  hideTimeout?: number;

  static Type = AlertType;
  static Heading = AlertHeading;
  static Actions = AlertActions;

  closeRequest = (event: React.MouseEvent<HTMLElement>) => {
    this.startCloseAnimation();
    return this.props.onCloseRequest(event);
  };

  startCloseAnimation = () => {
    const height = getRect(this.node).height;
    this.setState({height});
  };

  private _close() {
    this.startCloseAnimation();
    setTimeout(() => {
      this.props.onClose();
    }, ANIMATION_TIME);
  }

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  private _handleCaptionsLinksClick = (evt: React.MouseEvent<HTMLElement>) => {
    const link = evt.target instanceof Element ? evt.target.closest('a') : null;
    if (link != null && evt.currentTarget.contains(link)) {
      this.closeRequest(evt);
    }
  };

  /**
   * @private
   */
  private _getCaption() {
    return (
      <div
        className={classNames(styles.caption, this.props.captionClassName)}
        onClick={this._handleCaptionsLinksClick}
        // We only process clicks on `a` elements, see above
        role='presentation'
      >
        {this.props.children}
      </div>
    );
  }

  /**
   * @private
   * @return {XML|string}
   */
  private _getIcon() {
    const glyph = TypeToIcon[this.props.type];

    if (glyph) {
      return <Icon glyph={glyph} className={styles.icon} />;
    }
    if (this.props.type === AlertType.LOADING) {
      return <Loader className={styles.loader} />;
    }

    return '';
  }

  storeAlertRef = (node: HTMLDivElement | null) => {
    this.node = node;
  };

  render() {
    const {
      type,
      inline,
      isClosing,
      isShaking,
      closeButtonClassName,
      showWithAnimation,
      className,
      'data-test': dataTest,
      theme,
      afterMessage,
    } = this.props;

    const classes = classNames(className, {
      [styles.alert]: true,
      [styles.animationOpen]: showWithAnimation,
      [styles.error]: type === 'error',
      [styles.success]: type === 'success',
      [styles.warning]: type === 'warning',
      [styles.info]: type === 'info',
      [styles.alertInline]: inline,
      [styles.animationClosing]: isClosing,
      [styles.animationShaking]: isShaking,
    });

    const height = this.state.height;
    const style = height ? {marginBottom: -height} : undefined;

    const shownAfterMessage = normalizeAfterMessage(afterMessage);

    return (
      <ThemeProvider
        theme={theme}
        className={classes}
        data-test={dataTests('alert', dataTest)}
        data-test-type={type}
        style={style}
        ref={this.storeAlertRef}
      >
        {this._getIcon()}
        {this._getCaption()}
        {shownAfterMessage != null && (
          <div
            className={styles.afterMessage}
            onClick={this._handleCaptionsLinksClick}
            // We only process clicks on `a` elements, see above
            role='presentation'
          >
            {shownAfterMessage}
          </div>
        )}
        {this.props.closeable ? (
          <Button
            icon={closeIcon}
            className={classNames(styles.close, closeButtonClassName)}
            data-test='alert-close'
            aria-label='close alert'
            onClick={this.closeRequest}
          />
        ) : (
          ''
        )}
      </ThemeProvider>
    );
  }
}

export {default as Container} from './container';
