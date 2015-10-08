/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 */

import 'dom4';
import React, { createElement, Children, DOM } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import RingComponent from 'ring-component/ring-component';
import ClassName from 'class-name/class-name';
import Button from 'button/button';
import Icon from 'icon/icon';
import Popup from 'popup/popup';
import urlUtils from 'url-utils/url-utils';

import HeaderItem from './header__item';
import HeaderHelper from './header__helper';

import './header.scss';

const noop = () => {};

/**
 * @type {ClassName}
 * @private
 */
const headerClassName = new ClassName('ring-header');

/**
 * @const
 * @type {RegExp}
 */
var CUSTOM_ICON_SERVICE_REGEXP = /^teamcity|upsource|youtrack|hub$/i;

var PRUDUCTS_LOGOS = {
  hub: require('jetbrains-logos/hub/hub.svg'),
  teamcity: require('jetbrains-logos/teamcity/teamcity.svg'),
  upsource: require('jetbrains-logos/upsource/upsource.svg'),
  youtrack: require('jetbrains-logos/youtrack/youtrack.svg')
};

/**
 * Takes an item, decides, whether it is a known JetBrains service
 * and places a link to it to the services menu. Otherwise, returns
 * null.
 * @param {Object} item
 * @return {?string}
 */
function getServiceLogo(item) {
  let className = headerClassName.getElement('services-logo');

  // Remove after logos update
  let detectedService = CUSTOM_ICON_SERVICE_REGEXP.exec(item.applicationName);
  if (detectedService) {
    var serviceGlyph = PRUDUCTS_LOGOS[detectedService[0].toLowerCase()];

    return (
      <Icon size={Icon.Size.Size48}
            glyph={serviceGlyph}
            className={className} />
    );
  }

  if (item.iconUrl) {
    return (
      <span className={className} style={{'backgroundImage': 'url(' + item.iconUrl + ')'}}></span>
    );
  }

  return null;
};

/**
 * Sorts items by name and applicationName
 * @param itemA
 * @param itemB
 * @return {boolean}
 */
function sortServices(itemA, itemB) {
  let aApplicationName = itemA.applicationName || '';
  let bApplicationName = itemB.applicationName || '';

  return aApplicationName.localeCompare(bApplicationName) ||
         itemA.name.localeCompare(itemB.name);
};

/**
 * @enum {string}
 */
const MenuItemType = {
  HELP: 'help',
  LOGIN: 'loginButton',
  SETTINGS: 'settings',
  SERVICES: 'services',
  USER_MENU: 'userMenu'
};

/**
 * @type {Array.<MenuItemType>}
 */
const MenuItemsSequence = [
  MenuItemType.SETTINGS,
  MenuItemType.HELP,
  MenuItemType.SERVICES,
  MenuItemType.USER_MENU,
  MenuItemType.LOGIN
];


/**
 * @name Header
 * @constructor
 * @extends {ReactComponent}
 * @example
  <example name="Header">
    <file name="index.html">
      <div id="header-container"></div>
      <div class="page-content">Page content</div>
      <div class="popup-container"></div>
    </file>

    <file name="index.scss">
      body {
        background: #e8e8e9;
      }
      .page-content {
        background: #FFF;
        padding: 32px;
        height: 500px;
      }
    </file>

    <file name="index.js" webpack="true">
      require('./index.scss');
      var React = require('react');
      var ReactDOM = require('react-dom');
      var Header = require('header/header');
      var Popup = require('popup/popup');
      var Auth = require('auth/auth');
      var Link = require('link/link');

      var popup, popupContainer;

      var auth = new Auth({
        serverUri: '***REMOVED***/',
        request_credentials: 'skip',
        redirect_uri: window.location.href.split('#')[0]
      });

      // Render youtrack header to DOM. Help link leads to Yandex.
      // It's possible add a custom logotype into a Header via `logoUrl` parameter
      var header = ReactDOM.render(Header.factory({
        helpLink: 'http://www.yandex.ru',
        logo: 'youtrack',
        logoTitle: 'YouTrack',
        //menu: [
          //Link.factory({href: '#'}, 'Projects'),
          //Link.factory({href: '#'}, 'Dashboard')
        //]
        menu: [
          { component: Link, props: {href: '#'}, children: 'Projects' },
          { component: Link, props: {href: '#'}, children: 'Dashboard' }
        ]
      }), document.getElementById('header-container'));

      // Add callbacks for opening and closing settings element.
      header.rerender({
        onSettingsOpen: function() {
          popupContainer = document.querySelector('.popup-container');
          popup = ReactDOM.render(Popup.factory({
            anchorElement: ReactDOM.findDOMNode(header.refs['settings']),
            onClose: function() {
              header.refs['settings'].setOpened(false);
            }
          }, React.DOM.div(null, 'Popup content')),
          popupContainer)
        },

        onSettingsClose: function() {
          if (popup) {
            ReactDOM.unmountComponentAtNode(popupContainer);
            popup = null;
          }
        }
      });

      auth.init().then(function () {
        Header.HeaderHelper.setUserMenu(header, auth);
        Header.HeaderHelper.setServicesList(header, auth);
      });

      // Insert navigation, alternate way
      //var navigation = document.createElement('div');
      //navigation.innerHTML = 'Navigation';
      //header.getMenuElement().appendChild(navigation);

      // Insert extra element to right menu.
      var extraElement = document.createElement('input');
      header.getExtraElement().appendChild(extraElement);
    </file>
  </example>
 */
export default class Header extends RingComponent {
  static MenuItemType = MenuItemType;

  static HeaderHelper = HeaderHelper;

  static defaultProps = {
    enabledMenuItems: {
      [MenuItemType.SETTINGS]: true,
      [MenuItemType.HELP]: true,
      [MenuItemType.SERVICES]: true,
      [MenuItemType.USER_MENU]: true,
      [MenuItemType.LOGIN]: false
    },
    helpLink: null,
    logo: '',
    logoUrl: null,
    logoTitle: null,
    menu: [],
    profilePopupData: null,
    rightMenu: '',
    rootUrl: null,
    servicesList: null,
    settingsLink: null,
    translationsDict: {
      login: 'Log in...'
    },

    onHelpOpen: noop,
    onHelpClose: noop,
    onLoginClick: noop,
    onSettingsOpen: noop,
    onSettingsClose: noop,
    onServicesOpen: noop,
    onServicesClose: noop,
    onUserMenuOpen: noop,
    onUserMenuClose: noop
  };

  state = {
    profilePicture: null,
    servicesOpened: false
  };

  render() {
    let menuItemClassName = headerClassName.getElement('menu-item');

    return (
      <div className={headerClassName.getClassName()}>
        <div className={headerClassName.getElement('logo')}>{this._getLogo()}</div>
        <div className={headerClassName.getElement('menu')}>{
          // TODO починить (изменили интерфейс, но, кажется, это нигде не использовалось, проверить)
          /*Children.map(this.props.menu, function(item) {
            console.log(item);
            item.props.className = classNames(item.props.className, menuItemClassName);
            return item;
          })*/
          this.props.menu.map(({ component, props, children }) => {
            props = Object.assign({}, props, {className: classNames(props.className, menuItemClassName)});
            return component.factory(props, children);
          })
        }</div>
        {this._getRightMenu()}
      </div>
    );
  }

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _onServicesOpen() {
    if (this.props.onServicesOpen) {
      this.props.onServicesOpen();
      return;
    }

    this._setServicesPopupShown(true);
  }

  /**
   * @private
   */
  _onServicesClose() {
    if (this.props.onServicesClose) {
      this.props.onServicesClose();
      return;
    }

    if (this._servicesPopup) {
      this._setServicesPopupShown(false);
    }
  }

  /**
   * @param {string} href
   * @param {boolean} isActive
   * @param {string} className
   * @param {Array.<ReactComponent>|ReactComponent} children
   * @return {ReactComponent}
   * @private
   */
  _getLinkElement(href, isActive, className, children) {
    let fullClassName = classNames({
      [className]: true,
      [headerClassName.getClassName('services-current')]: isActive,
      [headerClassName.getClassName('services-link')]: !isActive
    });

    if (isActive) {
      return DOM.span({
        className: fullClassName
      }, children);
    }

    return DOM.a({
      href: href,
      key: href,
      className: fullClassName,
      target: '_self'
    }, children);
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getPopupContent() {
    let iconsList = [];
    let linksList = [];
    let baseUrl = (this.props.rootUrl || urlUtils.getAbsoluteBaseURL()).replace(urlUtils.ENDING_SLASH_PATTERN, '');

    this.props.servicesList.
      sort(sortServices).
      forEach(function(item) {
        if (!item.homeUrl) {
          return;
        }

        let isActive = item.id === this.props.clientId || item.homeUrl.replace(urlUtils.ENDING_SLASH_PATTERN, '') === baseUrl;
        let serviceLogo = getServiceLogo(item);

        if (serviceLogo) {
          iconsList.push(this._getLinkElement(item.homeUrl, isActive, headerClassName.getElement('services-item'), [
            serviceLogo,
            <span className={headerClassName.getElement('services-item-text')}>{item.name}</span>
          ]));

          return;
        }

        linksList.push(
          this._getLinkElement(item.homeUrl, isActive, headerClassName.getElement('services-stacked'), item.name)
        );
      }, this);

    if (iconsList.length && linksList.length) {
      return iconsList.concat(<div className={headerClassName.getElement('services-line')}></div>, linksList);
    }

    return iconsList.concat(linksList);
  }

  /**
   * Shows the list of services.
   * @param {boolean} show
   * @private
   */
  _setServicesPopupShown(show) {
    if (show) {
      this._servicesPopup = Popup.renderPopup(createElement(Popup, {
        anchorElement: findDOMNode(this.refs['services']),
        autoRemove: true,
        className: headerClassName.getClassName('services'),
        cutEdge: false,
        corner: Popup.PopupProps.Corner.BOTTOM_RIGHT,
        /* eslint-disable no-bitwise */
        direction: Popup.PopupProps.Direction.LEFT | Popup.PopupProps.Direction.DOWN,
        /* eslint-enable no-bitwise */
        onClose: () => this.refs['services'].setOpened(false),
        sidePadding: 32
      }, this._getPopupContent()));
    } else {
      this._servicesPopup.close();
      this._servicesPopup = null;
    }
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getLogo() {
    const getLogoContent = () => {
      let logoTitle = this.props.logoTitle || '';

      if (this.props.logoUrl) {
        return (
          <img src={this.props.logoUrl}
               className='ring-header__logo__custom-image'
               title={logoTitle}
               alt={logoTitle} />
        );
      }

      return <Icon size={Icon.Size.Size40} glyph={PRUDUCTS_LOGOS[this.props.logo] || this.props.logo} title={logoTitle} />;
    };

    // todo(igor.alexeenko): This check treats as valid only components
    // created by React.createClass(). If an already existing component such as
    // React.DOM.img is passed, it won't work.
    if (this.props.logo && typeof this.props.logo.setState !== 'undefined' &&
      typeof this.props.logo.render !== 'undefined') {
      return this.props.logo;
    }

    return (
      <a href={this.props.rootUrl || urlUtils.getBaseURI() || '/'}>{getLogoContent()}</a>
    );
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getRightMenu() {
    if (this.props.rightMenu) {
      //TODO починить
      return /** @type {ReactComponent} */ this.transferPropsTo(this.props.rightMenu);
    }

    let extraElementClassName = classNames({
      [headerClassName.getElement('user-menu-extra')]: true,
      [headerClassName.getElement('user-menu-item')]: true
    });

    return (
      <div className={headerClassName.getElement('right')}>
        <div className={headerClassName.getElement('user-menu')}>
          <div className={extraElementClassName}></div>
          {this.getMenuItems()}
        </div>
      </div>
    );
  }

  /**
   * @return {Element}
   */
  getExtraElement() {
    return this.node.query('.' + headerClassName.getElement('user-menu-extra'));
  }

  /**
   * @return {Element}
   */
  getMenuElement() {
    return this.node.query('.' + headerClassName.getElement('menu'));
  }

  /**
   * @return {Array.<ReactComponent>}
   */
  getMenuItems() {
    let loginClassName = classNames({
      [headerClassName.getElement('user-menu-item')]: true,
      [headerClassName.getClassName('user-menu-item', 'login')]: true
    });

    let menuItems = {
      [MenuItemType.SETTINGS]: (
        <HeaderItem
          key="settings"
          ref="settings"
          glyph={require('icon/source/cog.svg')}
          href={this.props.settingsLink}
          onOpen={this.props.onSettingsOpen}
          onClose={this.props.onSettingsClose}
          title="Administration"
        />
      ),

      [MenuItemType.HELP]: (
        <HeaderItem
          key="help"
          ref="help"
          glyph={require('icon/source/help.svg')}
          href={this.props.helpLink}
          onOpen={this.props.onHelpOpen}
          onClose={this.props.onHelpClose}
          title="Help"
        />
      ),

      [MenuItemType.SERVICES]: (
        <HeaderItem
          key="services"
          ref="services"
          glyph={require('icon/source/services.svg')}
          onOpen={::this._onServicesOpen}
          onClose={::this._onServicesClose}
          title="Services"
        />
      ),

      [MenuItemType.USER_MENU]: (
        <HeaderItem
          key="userMenu"
          ref="userMenu"
          glyph={require('icon/source/user1.svg')}
          onOpen={this.props.onUserMenuOpen}
          onClose={this.props.onUserMenuClose}
        />
      ),

      [MenuItemType.LOGIN]: (
        <div key="loginButton" ref="loginButton" className={loginClassName}>
          <Button modifier={Button.Modifiers.BLUE} onClick={this.props.onLoginClick}>{this.props.translationsDict.login}</Button>
        </div>
      )
    };

    return MenuItemsSequence.map(function(item) {
      if (this.props.enabledMenuItems[item]) {
        return menuItems[item];
      }
    }, this);
  }

  /**
   * @return {ReactComponent}
   */
  getUserMenu() {
    return this.refs['userMenu'];
  }

  /**
   * @return {ReactComponent}
   */
  getSettings() {
    return this.refs['settings'];
  }

  /**
   * Replaces standard user icon with avatar.
   * @param {string} src
   */
  setProfilePicture(src) {
    if (this.refs['userMenu']) {
      this.refs['userMenu'].setState({ picture: src });
    }
  }

  /**
   * @param {string} href
   */
  setSettingsLink(href) {
    this.rerender({ settingsLink: href });
  }

  /**
   * @param {Array.<Object>} services
   */
  setServicesList(services) {
    this.rerender({ servicesList: services });
  }

  /**
   * @param {MenuItemType} itemKey
   * @param {boolean=} enabled
   * @param {function=} callback
   */
  setMenuItemEnabled(itemKey, enabled, callback) {
    enabled = !!enabled;
    let enabledMenuItems = this.props.enabledMenuItems;

    if (enabledMenuItems[itemKey] !== enabled) {
      enabledMenuItems[itemKey] = enabled;
      this.rerender({ enabledMenuItems: enabledMenuItems }, callback);
    }
  }
}
