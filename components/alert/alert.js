import React from 'react';
import {findDOMNode, unmountComponentAtNode} from 'react-dom';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';
import Loader from '../loader-inline/loader-inline';

import './alert.scss';
import '../badge/badge.scss';

/**
 * @name Alert
 * @category Components
 * @description An alert can be used to display notifications, shown inline in context. If you want to display a stack of notifications, use **Alerts** instead.
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
const TypeToIconModifier = {
  [Type.ERROR]: require('jetbrains-icons/exception.svg'),
  [Type.SUCCESS]: require('jetbrains-icons/ok.svg'),
  [Type.WARNING]: require('jetbrains-icons/warning.svg')
};

/**
 * Lookup table of alert type to icon color.
 * @type {Object.<Type, Icon.Color>}
 */
const TypeToIconColor = {
  [Type.ERROR]: Icon.Color.RED,
  [Type.SUCCESS]: Icon.Color.GREEN,
  [Type.WARNING]: Icon.Color.ORANGE
};

/**
 * @const
 * @type {string}
 */
const BASE_CLASS = 'ring-alert';

/**
 * @constructor
 * @name Alert
 * @extends {ReactComponent}
 * @example
   <example name="Alert">
     <file name="index.html">
       <div id="alert-container"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Alert = require('ring-ui/components/alert/alert');

       var alert = render(Alert.factory({
         caption: 'Sample alert',
         closeable: true,
         type: Alert.Type.SUCCESS
       }), document.querySelector('#alert-container'));
     </file>
   </example>
 */
export default class Alert extends RingComponent {
  static Type = Type;

  /** @override */
  static defaultProps = {
    /** @type {Deferred} */
    animationDeferred: null,

    /** @type {ReactComponent|string} */
    caption: null,

    /** @type {boolean} */
    closeable: false,

    /**
     * Whether the component is rendered inside an {@code Alerts} container
     * or separately. Sometimes alerts are used to show messages
     * contextually.
     * @type {boolean}
     */
    inline: true,

    /**
     * Click handler on close element.
     * @type {?function(SyntheticMouseEvent):undefined}
     */
    onCloseClick: null,

    /** @type {Type} */
    type: Type.MESSAGE
  };

  didMount() {
    if (this.props.animationResolver) {
      if (typeof TransitionEvent === 'undefined') {
        this.props.animationResolver(this);
      }

      findDOMNode(this).addEventListener('transitionend', this._handleTransitionEnd);
    }
  }

  willUnmount() {
    findDOMNode(this).removeEventListener('transitionend', this._handleTransitionEnd);
  }

  /** @override */
  render() {
    const modifiedClassName = [BASE_CLASS, this.props.type].join('_');

    const classes = classNames({
      [BASE_CLASS]: true,
      [modifiedClassName]: true,
      'ring-alert_inline': this.props.inline
    });

    return (<div className={classes}>
      {this._getIcon()}
      {this._getCaption()}
      {
        this.props.closeable
        ? (
          <Icon
            className="ring-alert__close"
            glyph={require('jetbrains-icons/close.svg')}
            onClick={this._handleCloseClick}
            size={Icon.Size.Size16}
          />
        )
        : ''
      }
    </div>);
  }

  /**
   * Removes the component from the DOM.
   * @throws {Error} Throws an error if the component rendered as part of Alerts
   * stack is being deleted by this method.
   */
  close() {
    if (this.props.inline) {
      unmountComponentAtNode(findDOMNode(this).parentNode);
      return;
    }

    throw new Error('Use Alerts.prototype.remove(index) to remove an alert.');
  }

  /**
   * @private
   */
  _handleTransitionEnd = () => {
    if (this.props.animationResolver) {
      findDOMNode(this).removeEventListener('transitionend', this._handleTransitionEnd);
      this.props.animationResolver(this);
    }
  }

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _handleCloseClick = evt => {
    if (this.props.inline) {
      this.close();
    } else {
      this.props.onCloseClick(evt);
    }
  }

  /**
   * @private
   */
  _getCaption() {
    return (<span className="ring-alert__caption">{this.props.caption}{this.props.count > 1 && <span className="ring-badge ring-badge_gray">{this.props.count}</span>}</span>);
  }

  /**
   * @private
   * @return {XML|string}
   */
  _getIcon() {
    const iconModifier = TypeToIconModifier[this.props.type];

    if (iconModifier) {
      return (
        <Icon
          className="ring-alert__icon"
          color={TypeToIconColor[this.props.type] || Icon.Color.DEFAULT}
          glyph={iconModifier}
          size={Icon.Size.Size16}
        />
        );
    } else if (this.props.type === Type.LOADING) {
      return (
        <Loader className="ring-alert__loader"/>
      );
    }

    return '';
  }
}
