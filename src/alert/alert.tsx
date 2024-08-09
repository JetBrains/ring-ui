import {PureComponent, ReactNode} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import exceptionIcon from '@jetbrains/icons/exception';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import warningIcon from '@jetbrains/icons/warning';
import closeIcon from '@jetbrains/icons/close';

import Icon, {Color} from '../icon/icon';
import Loader from '../loader-inline/loader-inline';
import {getRect} from '../global/dom';
import dataTests from '../global/data-tests';

import Button from '../button/button';

import Theme, {ThemeProvider} from '../global/theme';

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
  LOADING = 'loading'
}

/**
 * Lookup table of alert type to icon modifier.
 * @type {Object.<AlertType, string>}
 */
const TypeToIcon: Partial<Record<AlertType, string>> = {
  [AlertType.ERROR]: exceptionIcon,
  [AlertType.SUCCESS]: checkmarkIcon,
  [AlertType.WARNING]: warningIcon
};

/**
 * Lookup table of alert type to icon color.
 * @type {Object.<AlertType, Icon.Color>}
 */
const TypeToIconColor: Partial<Record<AlertType, Color>> = {
  [AlertType.ERROR]: Color.RED,
  [AlertType.SUCCESS]: Color.GREEN,
  [AlertType.WARNING]: Color.WHITE
};

export interface AlertProps {
  theme: Theme,
  timeout: number
  /**
   * Fires when alert starts closing if timeout is out or user clicks "Close" button
   */
  onCloseRequest: ((event?: React.MouseEvent<HTMLElement>) => void)
  onClose: (() => void)
  isShaking: boolean
  isClosing: boolean
  /**
   * Whether an alert is rendered inside an **Alerts** container
   * or standalone.
   */
  inline: boolean
  showWithAnimation: boolean
  closeable: boolean
  type: AlertType
  children?: ReactNode
  className?: string | null | undefined
  captionClassName?: string | null | undefined
  closeButtonClassName?: string | null | undefined
  'data-test'?: string | null | undefined
}

interface State {
  height: number | null
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
    onCloseRequest: () => {}
  };

  state = {
    height: null
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
  private _handleCaptionsLinksClick = (evt: React.MouseEvent<HTMLSpanElement>) => {
    if (evt.target instanceof Element && evt.target.matches('a')) {
      this.closeRequest(evt);
    }
  };

  /**
   * @private
   */
  private _getCaption() {
    return (
      <span
        className={classNames(styles.caption, this.props.captionClassName, {
          [styles.withCloseButton]: this.props.closeable
        })}
        onClick={this._handleCaptionsLinksClick}
        // We only process clicks on `a` elements, see above
        role="presentation"
      >
        {this.props.children}
      </span>
    );
  }

  /**
   * @private
   * @return {XML|string}
   */
  private _getIcon() {
    const glyph = TypeToIcon[this.props.type];

    if (glyph) {
      return (
        <Icon
          glyph={glyph}
          className={styles.icon}
          color={TypeToIconColor[this.props.type] || Color.DEFAULT}
        />
      );
    } else if (this.props.type === AlertType.LOADING) {
      return (
        <Loader className={styles.loader}/>
      );
    }

    return '';
  }

  storeAlertRef = (node: HTMLDivElement | null) => {
    this.node = node;
  };

  render() {
    const {type, inline, isClosing, isShaking, closeButtonClassName,
      showWithAnimation, className, 'data-test': dataTest, theme} = this.props;

    const classes = classNames(className, {
      [styles.alert]: true,
      [styles.animationOpen]: showWithAnimation,
      [styles.error]: type === 'error',
      [styles.alertInline]: inline,
      [styles.animationClosing]: isClosing,
      [styles.animationShaking]: isShaking
    });

    const height = this.state.height;
    const style = height ? {marginBottom: -height} : undefined;

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
        {
          this.props.closeable
            ? (
              <Button
                icon={closeIcon}
                className={classNames(styles.close, closeButtonClassName)}
                data-test="alert-close"
                aria-label="close alert"
                onClick={this.closeRequest}
              />
            )
            : ''
        }
      </ThemeProvider>
    );
  }
}

export {default as Container} from './container';
