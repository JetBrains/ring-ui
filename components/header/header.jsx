/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./header.scss');
var Button = require('button/button');
var ClassName = require('class-name/class-name');
var Global = require('global/global');
var Icon = require('icon/icon');
var Popup = require('popup/popup');
var React = require('react/addons');
var urlUtils = require('url-utils/url-utils');

var HeaderItem = require('./header__item');

/**
 * @type {ClassName}
 * @private
 */
var headerClassName = new ClassName('ring-header');

/**
 * @const
 * @type {RegExp}
 */
var CUSTOM_ICON_SERVICE_REGEXP = /^teamcity|upsource|youtrack|hub|vcs hosting$/i;

/**
 * Takes an item, decides, whether it is a known JetBrains service
 * and places a link to it to the services menu. Otherwise, returns
 * null.
 * @param {Object} item
 * @return {?string}
 */
var getServiceLogo = function(item) {
  var className = headerClassName.getElement('services-logo');

  // Remove after logos update
  var detectedService = CUSTOM_ICON_SERVICE_REGEXP.exec(item.applicationName);
  if (detectedService) {
    var serviceGlyph = detectedService[0].
      toLowerCase().
      replace('hub', 'ring').
      replace(' ', '-');

    return (
      <Icon size={Icon.Size.Size48}
            glyph={serviceGlyph + '-monochrome'}
            className={className + '_monochrome ' + className} />
    );
  }

  if (item.iconUrl) {
    return (
      <span className={className} style={{'background-image': 'url(' + item.iconUrl + ')'}}></span>
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
var sortServices = function(itemA, itemB) {
  var aApplicationName = itemA.applicationName || '';
  var bApplicationName = itemB.applicationName || '';

  return aApplicationName.localeCompare(bApplicationName) ||
         itemA.name.localeCompare(itemB.name);
};

/**
 * @enum {string}
 */
var MenuItemType = {
  HELP: 'help',
  LOGIN: 'loginButton',
  SETTINGS: 'settings',
  SERVICES: 'services',
  USER_MENU: 'userMenu'
};

/**
 * @type {Array.<MenuItemType>}
 */
var MenuItemsSequence = [
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
      // You are also able to add a custom logotype into a Header via
      // logotype: {
      //   url: 'http://myLogo.png',
      //   title: 'Custom Logo'
      // }
      var header = React.renderComponent(new Header({
        helpLink: 'http://www.yandex.ru',
        logo: 'youtrack',
        menu: [
          Link({href: '#'}, 'Projects'),
          Link({href: '#'}, 'Dashboard')
        ]
      }), document.getElementById('header-container'));

      // Add callbacks for opening and closing settings element.
      header.setProps({
        onSettingsOpen: function() {
          popupContainer = document.querySelector('.popup-container');
          popup = React.renderComponent(
            new Popup({
              anchorElement: header.refs['settings'].getDOMNode(),
              onClose: function() {
                header.refs['settings'].setOpened(false);
              }
            }, React.DOM.div(null, 'Popup content')),
            popupContainer)
        },

        onSettingsClose: function() {
          if (popup) {
            React.unmountComponentAtNode(popupContainer);
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
var Header = React.createClass({
  statics: {
    MenuItemType: MenuItemType
  },

  getInitialState: function() {
    return {
      profilePicture: null,
      servicesOpened: false
    };
  },

  getDefaultProps: function() {
    return {
      enabledMenuItems: Global.createObject(
          MenuItemType.SETTINGS, true,
          MenuItemType.HELP, true,
          MenuItemType.SERVICES, true,
          MenuItemType.USER_MENU, true,
          MenuItemType.LOGIN, false),
      helpLink: null,
      logo: '',
      logotype: null,
      menu: '',
      profilePopupData: null,
      rightMenu: '',
      rootUrl: null,
      servicesList: null,
      settingsLink: null,
      translationsDict: {
        login: 'Log in...'
      },

      onHelpOpen: null,
      onHelpClose: null,
      onLoginClick: null,
      onSettingsOpen: null,
      onSettingsClose: null,
      onServicesOpen: null,
      onServicesClose: null,
      onUserMenuOpen: null,
      onUserMenuClose: null
    };
  },

  render: function() {
    var menuItemClassName = headerClassName.getElement('menu-item');

    return (<div className={headerClassName.getClassName()}>
      <div className={headerClassName.getElement('logo')}>{this._getLogo()}</div>
      <div className={headerClassName.getElement('menu')}>{React.Children.map(this.props.menu, function(item) {
        var className = item.props.className && item.props.className.split(' ') || [];

        if (className.indexOf(menuItemClassName) === -1) {
          className.push(menuItemClassName);
        }

        item.props.className = className.join(' ');

        return item;
      })}</div>
      {this._getRightMenu()}
    </div>);
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _onServicesOpen: function() {
    if (this.props.onServicesOpen) {
      this.props.onServicesOpen();
      return;
    }

    this._setServicesPopupShown(true);
  },

  /**
   * @private
   */
  _onServicesClose: function() {
    if (this.props.onServicesClose) {
      this.props.onServicesClose();
      return;
    }

    if (this._servicesPopup) {
      this._setServicesPopupShown(false);
    }
  },


  /**
   * @param {string} href
   * @param {boolean} isActive
   * @param {string} className
   * @param {Array.<ReactComponent>|ReactComponent} children
   * @return {ReactComponent}
   * @private
   */
  _getLinkElement: function(href, isActive, className, children) {
    var fullClassName = React.addons.classSet(Global.createObject(
      className, true,
      headerClassName.getClassName('services-current'), isActive,
      headerClassName.getClassName('services-link'), !isActive));

    if (isActive) {
      return React.DOM.span({
        className: fullClassName
      }, children);
    }

    return React.DOM.a({
      href: href,
      key: href,
      className: fullClassName,
      target: '_self'
    }, children);
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getPopupContent: function () {
    var iconsList = [];
    var linksList = [];
    var baseUrl = (this.props.rootUrl || urlUtils.getAbsoluteBaseURL()).replace(urlUtils.ENDING_SLASH_PATTERN, '');

    this.props.servicesList.
      sort(sortServices).
      forEach(function(item) {
        if (!item.homeUrl) {
          return;
        }

        var isActive = item.id === this.props.clientId || item.homeUrl.replace(urlUtils.ENDING_SLASH_PATTERN, '') === baseUrl;
        var serviceLogo = getServiceLogo(item);

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
  },

  /**
   * Shows the list of services.
   * @param {boolean} show
   * @private
   */
  _setServicesPopupShown: function(show) {
    if (show) {
      this._servicesPopup = Popup.renderComponent(new Popup({
        anchorElement: this.refs['services'].getDOMNode(),
        autoRemove: true,
        className: headerClassName.getClassName('services'),
        cutEdge: false,
        corner: Popup.PopupProps.Corner.BOTTOM_RIGHT,
        /* eslint-disable no-bitwise */
        direction: Popup.PopupProps.Direction.LEFT | Popup.PopupProps.Direction.DOWN,
        /* eslint-enable no-bitwise */
        onClose: function() {
          this.refs['services'].setOpened(false);
        }.bind(this),
        sidePadding: 32
      }, this._getPopupContent()));
    } else {
      this._servicesPopup.close();
      this._servicesPopup = null;
    }
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getLogo: function() {
    var getLogoContent = function() {
      if (!this.props.logotype) {
        return <Icon size={Icon.Size.Size32} glyph={this.props.logo}/>;
      }

      var logoUrl = '';
      var logoTitle = '';

      if (typeof this.props.logotype === 'string') {
        logoUrl = this.props.logotype;
      }
      if (typeof this.props.logotype === 'object') {
        logoUrl = this.props.logotype.url || '';
        logoTitle = this.props.logotype.title || '';
      }

      return React.DOM.img({
        className: 'ring-header__logo__custom-image',
        src: logoUrl,
        title: logoTitle,
        alt: ''
      });
    }.bind(this);

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
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getMenu: function() {
    if (this.props.menu) {
      return /** @type {ReactComponent} */ this.transferPropsTo(this.props.menu);
    }

    return '';
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getRightMenu: function() {
    if (this.props.rightMenu) {
      return /** @type {ReactComponent} */ this.transferPropsTo(this.props.rightMenu);
    }

    var extraElementClassName = React.addons.classSet(Global.createObject(
        headerClassName.getElement('user-menu-extra'), true,
        headerClassName.getElement('user-menu-item'), true));

    return (
      <div className={headerClassName.getElement('right')}>
        <div className={headerClassName.getElement('user-menu')}>
          <div className={extraElementClassName}></div>
          {this.getMenuItems()}
        </div>
      </div>
    );
  },

  /**
   * @return {Element}
   */
  getExtraElement: function() {
    return this.getDOMNode().querySelector('.' + headerClassName.getElement('user-menu-extra'));
  },

  /**
   * @return {Element}
   */
  getMenuElement: function() {
    return this.getDOMNode().querySelector('.' + headerClassName.getElement('menu'));
  },

  /**
   * @return {Array.<ReactComponent>}
   */
  getMenuItems: function() {
    var loginClassName = React.addons.classSet(Global.createObject(
        headerClassName.getElement('user-menu-item'), true,
        headerClassName.getClassName('user-menu-item', 'login'), true));

    var menuItems = Global.createObject(
        MenuItemType.SETTINGS, (<HeaderItem key="settings" ref="settings" glyph="cog1" href={this.props.settingsLink} onOpen={this.props.onSettingsOpen} onClose={this.props.onSettingsClose} title="Administration" />),
        MenuItemType.HELP, (<HeaderItem key="help" ref="help" glyph="help" href={this.props.helpLink} onOpen={this.props.onHelpOpen} onClose={this.props.onHelpClose} title="Help" />),
        MenuItemType.SERVICES, (<HeaderItem key="services" ref="services" glyph="services" onOpen={this._onServicesOpen} onClose={this._onServicesClose} title="Services" />),
        MenuItemType.USER_MENU, (<HeaderItem key="userMenu" ref="userMenu" glyph="user1" onOpen={this.props.onUserMenuOpen} onClose={this.props.onUserMenuClose} />),
        MenuItemType.LOGIN, (<div key="loginButton" ref="loginButton" className={loginClassName}><Button modifier={Button.Modifiers.BLUE} onClick={this.props.onLoginClick}>{this.props.translationsDict.login}</Button></div>));

    return MenuItemsSequence.map(function(item) {
      if (this.props.enabledMenuItems[item]) {
        return menuItems[item];
      }
    }, this);
  },

  /**
   * @return {ReactComponent}
   */
  getUserMenu: function() {
    return this.refs['userMenu'];
  },

  /**
   * @return {ReactComponent}
   */
  getSettings: function() {
    return this.refs['settings'];
  },

  /**
   * Replaces standard user icon with avatar.
   * @param {string} src
   */
  setProfilePicture: function(src) {
    if (this.refs['userMenu']) {
      this.refs['userMenu'].setState({ picture: src });
    }
  },

  /**
   * @param {string} href
   */
  setSettingsLink: function(href) {
    this.setProps({ settingsLink: href });
  },

  /**
   * @param {Array.<Object>} services
   * @deprecated setProps to be used here
   */
  setServicesList: function(services) {
    this.setProps({ servicesList: services });
  },

  /**
   * @param {MenuItemType} itemKey
   * @param {boolean=} enabled
   * @param {function=} callback
   */
  setMenuItemEnabled: function(itemKey, enabled, callback) {
    enabled = !!enabled;
    var enabledMenuItems = this.props.enabledMenuItems;

    if (enabledMenuItems[itemKey] !== enabled) {
      enabledMenuItems[itemKey] = enabled;
      this.setProps({ enabledMenuItems: enabledMenuItems }, callback);
    }
  }
});


module.exports = Header;
module.exports.HeaderHelper = require('./header__helper');
