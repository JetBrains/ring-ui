import 'dom4';
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import exceptionIcon from '@jetbrains/icons/exception.svg';
import checkmarkIcon from '@jetbrains/icons/checkmark.svg';
import warningIcon from '@jetbrains/icons/warning.svg';
import closeIcon from '@jetbrains/icons/close.svg';

import Icon from '../icon';
import Loader from '../loader-inline/loader-inline';
import {getRect} from '../global/dom';
import dataTests from '../global/data-tests';

import styles from './alert.css';

export const ANIMATION_TIME = 500;

/**
 * @name Alert
 */

/**
 * List of available alert types.
 * @enum {string}
 */
const Type = {
  ERROR: 'error',
  MESSAGE: 'message',
  SUCCESS: 'success',
  WARNING: 'warning',
  LOADING: 'loading'
};

/**
 * Lookup table of alert type to icon modifier.
 * @type {Object.<Type, string>}
 */
const TypeToIcon = {
  [Type.ERROR]: exceptionIcon,
  [Type.SUCCESS]: checkmarkIcon,
  [Type.WARNING]: warningIcon
};

/**
 * Lookup table of alert type to icon color.
 * @type {Object.<Type, Icon.Color>}
 */
const TypeToIconColor = {
  [Type.ERROR]: Icon.Color.RED,
  [Type.SUCCESS]: Icon.Color.GREEN,
  [Type.WARNING]: Icon.Color.WHITE
};

/**
 * @constructor
 * @name Alert
 * @extends {ReactComponent}
 */
/**
 * **Alert** is a component for displaying contextual notifications. If you want to display a stack of notifications, use **Alerts** instead.
 */
// eslint-disable-next-line react/no-deprecated
export default class Alert extends PureComponent {
  static Type = Type;

  static propTypes = {
    timeout: PropTypes.number,
    /**
     * Fires when alert starts closing if timeout is out or user clicks "Close" button
     * @type {?function(SyntheticMouseEvent):undefined}
     */
    onCloseRequest: PropTypes.func,
    onClose: PropTypes.func,
    isShaking: PropTypes.bool,
    isClosing: PropTypes.bool,
    /**
     * Whether an alert is rendered inside an {@code Alerts} container
     * or standalone.
     * @type {boolean}
     */
    inline: PropTypes.bool,
    showWithAnimation: PropTypes.bool,
    closeable: PropTypes.bool,
    type: PropTypes.oneOf(Object.values(Type)),

    children: PropTypes.node,
    className: PropTypes.string,
    captionClassName: PropTypes.string,
    'data-test': PropTypes.string
  };

  /** @override */
  static defaultProps = {
    /** @type {boolean} */
    closeable: true,
    showWithAnimation: true,
    type: Type.MESSAGE,
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
      this.hideTimeout = setTimeout(this.closeRequest, this.props.timeout);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isClosing) {
      this._close();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  closeRequest = (...args) => {
    const height = getRect(this.node).height;
    this.setState({height});
    return this.props.onCloseRequest(...args);
  };

  _close() {
    setTimeout(() => {
      this.props.onClose();
    }, ANIMATION_TIME);
  }

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _handleCaptionsLinksClick = evt => {
    if (evt.target.matches('a')) {
      this.closeRequest(evt);
    }
  };

  /**
   * @private
   */
  _getCaption() {
    return (
      <span
        className={classNames(styles.caption, this.props.captionClassName)}
        onClick={this._handleCaptionsLinksClick}
      >
        {this.props.children}
      </span>
    );
  }

  /**
   * @private
   * @return {XML|string}
   */
  _getIcon() {
    const glyph = TypeToIcon[this.props.type];

    if (glyph) {
      return (
        <Icon
          glyph={glyph}
          className={styles.icon}
          color={TypeToIconColor[this.props.type] || Icon.Color.DEFAULT}
        />
      );
    } else if (this.props.type === Type.LOADING) {
      return (
        <Loader className={styles.loader} theme={Loader.Theme.DARK}/>
      );
    }

    return '';
  }

  storeAlertRef = node => {
    this.node = node;
  };

  render() {
    const {type, inline, isClosing, isShaking,
      showWithAnimation, className, 'data-test': dataTest} = this.props;

    const classes = classNames(className, {
      [styles.alert]: true,
      [styles.animationOpen]: showWithAnimation,
      [styles.error]: type === 'error',
      [styles.alertInline]: inline,
      [styles.animationClosing]: isClosing,
      [styles.animationShaking]: isShaking
    });

    const style = this.state.height ? {marginBottom: -this.state.height} : null;

    return (
      <div
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
              <button
                type="button"
                className={styles.close}
                data-test="alert-close"
                aria-label="close alert"
                onClick={this.closeRequest}
              >
                <Icon glyph={closeIcon}/>
              </button>
            )
            : ''
        }
      </div>
    );
  }
}

export {default as Container} from './container';
