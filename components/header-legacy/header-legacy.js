/**
 * @name Header Legacy
 * @category Components
 * @description Displays a configurable page header.
 */
/* eslint-disable react/no-multi-comp */

import 'dom4';
import React, {createElement, DOM} from 'react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';
import Button from '../button/button';
import Icon from '../icon/icon';
import Popup from '../popup/popup';
import {getAbsoluteBaseURL, getBaseURI, ENDING_SLASH_PATTERN} from '../global/url';

import HeaderItem from './header-legacy__item';
import HeaderHelper from './header-legacy__helper';
import PopupMenu from '../popup-menu/popup-menu';
import debounce from 'mout/function/debounce';

import './header-legacy.scss';

function noop() {}

/**
 * @const
 * @type {RegExp}
 */
const TOP_LINE_SERVICES_REGEXP = /^dashboard|project\swizard$/i;

const PRODUCTS_LOGOS = {
  hub: require('jetbrains-logos/hub/hub.svg'),
  teamcity: require('jetbrains-logos/teamcity/teamcity.svg'),
  upsource: require('jetbrains-logos/upsource/upsource.svg'),
  youtrack: require('jetbrains-logos/youtrack/youtrack.svg'),
  dashboard: require('jetbrains-icons/gauge.svg'),
  'project wizard': require('jetbrains-icons/puzzle.svg')
};

/**
 * Takes an item, decides whether it is a known JetBrains service
 * and places a link to it in the services menu. Otherwise, returns
 * null.
 * @param {Object} item
 * @return {?string}
 */
function getServiceLogo(item, customClassName, iconSize = Icon.Size.Size48) {
  const className = classNames('ring-header__services-logo', customClassName);
  const iconKey = `ItemIcon-${item.id}`;
  const topLineServiceIcon = TOP_LINE_SERVICES_REGEXP.exec(item.applicationName);

  if (topLineServiceIcon) {
    const serviceGlyph = PRODUCTS_LOGOS[topLineServiceIcon[0].toLowerCase()];

    return (
      <Icon
        className={className}
        key={iconKey}
        glyph={serviceGlyph}
        size={iconSize}
      />
    );
  }

  if (item.iconUrl) {
    return (
      <span
        key={iconKey}
        className={className}
        style={{backgroundImage: `url(${item.iconUrl})`}}
      />
    );
  }

  return null;
}

/**
 * Sorts items by name and applicationName
 * @param itemA
 * @param itemB
 * @return {boolean}
 */
function sortServices(itemA, itemB) {
  const aApplicationName = itemA.applicationName || '';
  const bApplicationName = itemB.applicationName || '';

  return aApplicationName.localeCompare(bApplicationName) ||
    itemA.name.localeCompare(itemB.name);
}

/**
 * @enum {string}
 */
const MenuItemType = {
  HELP: 'help',
  LOGIN: 'loginButton',
  SETTINGS: 'settings',
  SERVICES: 'services',
  USER_MENU: 'userMenu',
  NAVIGATION_MENU: 'navigationMenu'
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
 * @constructor
 * @extends {ReactComponent}
 * @example-file ./header-legacy.examples.html
 */
export default class Header extends RingComponent {
  static MenuItemType = MenuItemType;

  static HeaderHelper = HeaderHelper;

  static defaultProps = {
    layout: HeaderHelper.getLayoutType(),
    customItems: [],
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
    rightMenu: [],
    profilePopupData: null,
    rootUrl: null,
    servicesList: null,
    settingsLink: null,
    translationsDict: {
      login: 'Log in...',
      help: 'Help',
      services: 'Services',
      settings: 'Administration'
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

  /**
   * Checks if a service is opened in the browser at the moment
   * @param rootUrl - URL of current application
   * @param clientId - Client ID of current application
   * @param serviceId - ID of the service being checked
   * @param serviceHomeUrl - URL of the service being checked
   * @returns {boolean}
   */
  static isActiveService(rootUrl, clientId, serviceId, serviceHomeUrl) {
    const baseUrl = (rootUrl || getAbsoluteBaseURL()).replace(ENDING_SLASH_PATTERN, '');

    return serviceId === clientId || serviceHomeUrl.replace(ENDING_SLASH_PATTERN, '') === baseUrl;
  }

  /**
   * Checks if a service should be placed in the first line of services list
   * @param service - service to check
   */
  static isTopLineService(service) {
    return TOP_LINE_SERVICES_REGEXP.test(service.applicationName);
  }

  state = {
    profilePicture: null,
    servicesOpened: false
  };

  _setResizeListener() {
    const updateLayout = () => {
      const newLayout = HeaderHelper.getLayoutType();

      if (this.props.layout && this.props.layout !== newLayout) {
        this.rerender({
          layout: newLayout
        });
      }
    };

    this.debouncedUpdate = debounce(updateLayout, 50);
    window.addEventListener('resize', this.debouncedUpdate);
  }

  constructor() {
    super();
    this._setResizeListener();
  }

  /**
   * Default layout with a list of navigation items set via header API
   * @private
   */
  _getNavigationMenuDefaultLayout() {
    return (
      <div className="ring-header__menu">{
        this.props.menu.map(({component, props, children}) => {
          const newProps = Object.assign({}, props, {className: classNames(props.className, 'ring-header__menu-item')});
          return createElement(component, newProps, children);
        })
      }</div>
    );
  }

  /**
   * @returns {Array}
   * @private
   */
  _getMenuPopupData() {
    return this.props.menu.slice(1).map(item => {
      const classes = classNames(item.props.className || '', 'ring-header__menu-item');
      return {
        rgItemType: PopupMenu.ListProps.Type.LINK,
        className: classes,
        label: item.children,
        url: item.props.href
      };
    });
  }

  /**
   * @private
   */
  _setNavigationPopupMenu() {
    if (!this.navigationPopup) {
      const menuPopupData = this._getMenuPopupData();

      this.navigationPopup = PopupMenu.renderPopup(
        <PopupMenu
          anchorElement={this.refs.navigationMenu.node}
          autoRemove={true}
          className={this.props.popupClassName}
          data={menuPopupData}
          directions={[PopupMenu.PopupProps.Directions.BOTTOM_LEFT]}
          sidePadding={32}
        />
      );
    }
  }

  /**
   * @private
   */
  _getNavigationMenuCompactLayout() {
    const firstMenuElement = this.props.menu[0];

    return (
      <div className="ring-header__menu">
        <span>
          <a className="ring-link"
            href={firstMenuElement.props.url}
          >{firstMenuElement.children}</a>
          <Icon
            ref={MenuItemType.NAVIGATION_MENU}
            className="ring-header__menu__dropdown"
            glyph={require('jetbrains-icons/caret-down.svg')}
            size={Icon.Size.Size16}
            onClick={::this._setNavigationPopupMenu}
          />
        </span>
      </div>
    );
  }

  /**
   * @private
   */
  _getNavigationMenu() {
    if (this.props.layout !== HeaderHelper.layout.DEFAULT &&
      this.props.menu.length > 1) {
      return this._getNavigationMenuCompactLayout();
    } else {
      return this._getNavigationMenuDefaultLayout();
    }
  }

  render() {
    return (
      <div className="ring-header">
        <div className="ring-header__logo">
          {this._getLogo()}
        </div>

        {this._getNavigationMenu()}
        {this._getRightMenu()}
      </div>
    );
  }

  /**
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
    const fullClassName = classNames({
      [className]: true,
      'ring-header__services-current': isActive,
      'ring-header__services-link': !isActive
    });

    if (isActive) {
      return DOM.span({
        key: href,
        className: fullClassName
      }, children);
    }

    return DOM.a({
      href,
      key: href,
      className: fullClassName,
      target: '_self'
    }, children);
  }

  _renderServiceLinkWithLogo(item, serviceLogo) {
    const isActive = Header.isActiveService(this.props.rootUrl, this.props.clientId, item.id, item.homeUrl);

    return this._getLinkElement(item.homeUrl, isActive, 'ring-header__services-item', [
      serviceLogo,
      <span key={`ItemName-${item.id}`}
        className="ring-header__services-item-text"
      >
        {item.name}
      </span>
    ]);
  }

  _getPopupTopLine() {
    return this.props.servicesList.sort(sortServices).
      filter(Header.isTopLineService).
      map(item => this._renderServiceLinkWithLogo(item, getServiceLogo(item, 'ring-header__services-logo_top-line', Icon.Size.Size32)));
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getPopupContent() {
    const iconsList = [];
    const linksList = [];

    this.props.servicesList.sort(sortServices).
      filter(service => !Header.isTopLineService(service)).
      forEach(function (item) {
        if (!item.homeUrl) {
          return;
        }

        const serviceLogo = getServiceLogo(item);

        if (serviceLogo) {
          iconsList.push(this._renderServiceLinkWithLogo(item, serviceLogo));
          return;
        }

        const isActive = Header.isActiveService(this.props.rootUrl, this.props.clientId, item.id, item.homeUrl);

        linksList.push(
          this._getLinkElement(item.homeUrl, isActive, 'ring-header__services-stacked', item.name)
        );
      }, this);

    if (iconsList.length && linksList.length) {
      return iconsList.concat((
        <div
          className="ring-header__services-line"
          key="separator"
        />
      ), linksList);
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
        anchorElement: findDOMNode(this.refs.services),
        autoRemove: true,
        className: 'ring-header__services',
        cutEdge: false,
        directions: [PopupMenu.PopupProps.Directions.BOTTOM_LEFT],
        onClose: () => this.refs.services.setOpened(false),
        sidePadding: 32
      }, <div>
        <div>{this._getPopupTopLine()}</div>
        <div>{this._getPopupContent()}</div>
      </div>));
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
      const logoTitle = this.props.logoTitle || '';

      if (this.props.logoUrl) {
        return (
          <img
            alt={logoTitle}
            className="ring-header__logo__custom-image"
            src={this.props.logoUrl}
            title={logoTitle}
          />
        );
      }

      return (
        <Icon
          glyph={PRODUCTS_LOGOS[this.props.logo] || this.props.logo}
          title={logoTitle}
          size={Icon.Size.Size40}
        />
      );
    };

    // FIXME this check treats only components created by
    // React.createClass() as valid. If an already existing component such as
    // React.DOM.img is passed, it won't work.
    if (this.props.logo && typeof this.props.logo.setState !== 'undefined' &&
      typeof this.props.logo.render !== 'undefined') {
      return this.props.logo;
    }

    return (
      <a
        href={this.props.rootUrl || getBaseURI() || '/'}
      >{getLogoContent()}</a>
    );
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getRightMenu() {
    const extraElementClassName = classNames({
      'ring-header__user-menu-extra': true,
      'ring-header__user-menu-item': true
    });

    return (
      <div className="ring-header__right">
        <div className="ring-header__user-menu">
          <div className={extraElementClassName} />
          {
            this.props.rightMenu.map(({component, props, children}) => (
              <div
                className={extraElementClassName}
                key={props.key}
              >
                {createElement(component, props, children)}
              </div>
            ))
          }
          {this.getMenuItems()}
        </div>
      </div>
    );
  }

  /**
   * @deprecated It's better to pass the required items to props.rightMenu than to patch
   * this element
   * @return {Element}
   */
  getExtraElement() {
    return this.node.query('.ring-header__user-menu-extra');
  }

  /**
   * @deprecated It's better to pass the required items to props.menu than to patch
   * this element
   * @return {Element}
   */
  getMenuElement() {
    return this.node.query('.ring-header__menu');
  }

  /**
   * @return {Array.<ReactComponent>}
   */
  getMenuItems() {
    const loginClassName = classNames({
      'ring-header__user-menu-item': true,
      'ring-header__user-menu-item_login': true
    });

    const menuItems = {
      [MenuItemType.SETTINGS]: (
        <HeaderItem
          key="settings"
          ref="settings"
          testKey="settings"
          glyph={require('jetbrains-icons/cog.svg')}
          href={this.props.settingsLink}
          onOpen={this.props.onSettingsOpen}
          onClose={this.props.onSettingsClose}
          inactiveClassName="ring-header__menu-item-cog"
          activeClassName="ring-header__menu-item-cog ring-header__menu-item-cog_rotated"
          title={this.props.translationsDict.settings}
        />
      ),

      [MenuItemType.HELP]: (
        <HeaderItem
          key="help"
          ref="help"
          testKey="help"
          glyph={require('jetbrains-icons/help.svg')}
          href={this.props.helpLink}
          onOpen={this.props.onHelpOpen}
          onClose={this.props.onHelpClose}
          title={this.props.translationsDict.help}
        />
      ),

      [MenuItemType.SERVICES]: (
        <HeaderItem
          key="services"
          ref="services"
          testKey="services"
          glyph={require('jetbrains-icons/services.svg')}
          onOpen={::this._onServicesOpen}
          onClose={::this._onServicesClose}
          title={this.props.translationsDict.services}
        />
      ),

      [MenuItemType.USER_MENU]: (
        <HeaderItem
          key="userMenu"
          ref="userMenu"
          testKey="user-menu"
          glyph={require('jetbrains-icons/user1.svg')}
          onOpen={this.props.onUserMenuOpen}
          onClose={this.props.onUserMenuClose}
        />
      ),

      [MenuItemType.LOGIN]: (
        <div
          className={loginClassName}
          key="loginButton"
          ref="loginButton"
          data-test="header-login-button"
        >
          <Button
            primary={true}
            onClick={this.props.onLoginClick}
          >{this.props.translationsDict.login}</Button>
        </div>
      )
    };

    const predefinedItems = MenuItemsSequence.
      filter(item => this.props.enabledMenuItems[item]).
      map(item => menuItems[item]);

    const customItems = this.props.customItems.
      map(item => (
        <HeaderItem
          {...item}
        />));

    return customItems.concat(predefinedItems);
  }

  /**
   * @return {ReactComponent}
   */
  getUserMenu() {
    return this.refs.userMenu;
  }

  /**
   * @return {ReactComponent}
   */
  getSettings() {
    return this.refs.settings;
  }

  /**
   * Replaces a default user icon with an avatar.
   * @param {string} src
   */
  setProfilePicture(src) {
    if (this.refs.userMenu) {
      this.refs.userMenu.setState({picture: src});
    }
  }

  /**
   * @param {string} href
   */
  setSettingsLink(href) {
    this.rerender({settingsLink: href});
  }

  /**
   * @param {Header} header header instance to be modified
   * @param {Promise|Object} settingsListData promise that returns list data in a format
   * accepted by PopupMenu.
   */
  setSettingsMenu(settingsListData) {
    let popup = null;
    this.rerender({
      onSettingsOpen: () => {
        Promise.resolve(settingsListData).then(data => {
          popup = PopupMenu.renderPopup(PopupMenu.factory({
            anchorElement: findDOMNode(this.refs.settings),
            data,
            directions: [PopupMenu.PopupProps.Directions.BOTTOM_LEFT],
            onClose: () => this.refs.settings.setOpened(false),
            onSelect: () => popup.close()
          }));
        });
      },

      onSettingsClose: () => {
        if (popup) {
          popup.remove();
          popup = null;
        }
      }
    });
  }

  /**
   * @param {Array.<Object>} services
   */
  setServicesList(services) {
    this.rerender({servicesList: services});
  }

  /**
   * @param {MenuItemType} itemKey
   * @param {boolean=} enabled
   * @param {function=} callback
   */
  setMenuItemEnabled(itemKey, enabled, callback) {
    const enabledBool = !!enabled;
    const {enabledMenuItems} = this.props;

    if (enabledMenuItems[itemKey] !== enabledBool) {
      enabledMenuItems[itemKey] = enabledBool;
      this.rerender({enabledMenuItems}, callback);
    }
  }
}
