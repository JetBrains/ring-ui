/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./header.scss');
var ClassName = require('class-name/class-name');
var Global = require('global/global');
var Icon = require('icon/icon'); // jshint -W098
var PopupMenu = require('popup-menu/popup-menu');
var React = require('react/addons');


/**
 * @type {ClassName}
 * @private
 */
var headerClassName = new ClassName('ring2-header');


/**
 * @constructor
 * @extends {ReactComponent}
 * @private
 */
var HeaderLogo = React.createClass({
  getDefaultProps: function() {
    return { glyph: '' };
  },

  render: function() {
    /* jshint ignore:start */
    return (<a href="/"><Icon size={Icon.Size.Size32} glyph={this.props.glyph} /></a>);
    /* jshint ignore:end */
  }
});



/**
 * @constructor
 * @extends {ReactComponent}
 * @private
 */
var MenuItem = React.createClass({
  getDefaultProps: function () {
    return {
      glyph: '',
      href: null,
      onOpen: null,
      onClose: null
    };
  },

  getInitialState: function () {
    return {
      loading: false,
      opened: false,
      picture: null,
      title: ''
    };
  },

  render: function () {
    /* jshint ignore:start */
    var className = React.addons.classSet(Global.createObject(
        headerClassName.getClassName('user-menu-item'), true,
        headerClassName.getClassName('user-menu-item', 'icon'), true,
        headerClassName.getClassName('user-menu-item', this.props.glyph), true,
        'ring-icon_loading', this.state.loading));

    // NB! Wrapping span is needed because otherwise selenium tests couldn't
    // trigger the click on the <SVG /> element.
    var iconElement = this.state.picture ? this._getImage() : this._getIcon();
    var menuElement = (<span className={className} onClick={this._handleClick} title={this.state.title}>
      {this.props.href ?
          (<a href={this.props.href}>{this.transferPropsTo(iconElement)}</a>) :
          this.transferPropsTo(iconElement)}
    </span>);

    return this.transferPropsTo(menuElement);
    /* jshint ignore:end */
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleClick: function(evt) {
    if (!this.props.href) {
      evt.preventDefault();
      this.setOpened(!this.state.opened);
    }
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getImage: function() {
    // todo(igor.alexeenko): Make image size customizable.
    // Now it is hardcoded for avatar in header.

    /* jshint ignore:start */
    var baseClass = new ClassName('ring-icon');
    var className = React.addons.classSet(Global.createObject(
        baseClass.getClassName(), true,
        baseClass.getModifier('24'), true,
        baseClass.getModifier(this.props.glyph), true));

    return (<img
        className={className}
        src={this.state.picture}
        height="24"
        title={this.state.title}
        width="24" />);
    /* jshint ignore:end */
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getIcon: function() {
    /* jshint ignore:start */
    return (<Icon
        color={this.state.opened ? 'blue' : 'gray'}
        glyph={this.props.glyph}
        size={Icon.Size.Size18}
        title={this.state.title} />);
    /* jshint ignore:end */
  },

  /**
   * @param {boolean} opened
   */
  setOpened: function (opened) {
    this.setState({opened: opened}, function () {
      if (opened) {
        if (typeof this.props.onOpen === 'function') {
          this.props.onOpen();
        }
      } else {
        if (typeof this.props.onClose === 'function') {
          this.props.onClose();
        }
      }
    });
  },

  /**
   * @param {string} title
   */
  setTitle: function(title) {
    this.setState({ title: title });
  },

  /**
   * @param {boolean} loading
   */
  setLoading: function(loading) {
    this.setState({ loading: loading });
  }
});


/**
 * List of known services with logos.
 * @enum {string}
 */
var KnownService = {
  TEAMCITY: 'teamcity',
  UPSOURCE: 'upsource',
  YOUTRACK: 'youtrack'
};

/**
 * @Object.<KnownService, string>
 */
var KnownServiceLogo = Global.createObject(
    KnownService.TEAMCITY, 'teamcity-monochrome',
    KnownService.YOUTRACK, 'youtrack-monochrome',
    KnownService.UPSOURCE, 'upsource-monochrome');

/**
 * @const
 * @type {RegExp}
 */
var VENDOR_REGEXP = /jetbrains/i;

/**
 * Takes an item, decides, whether it is a known JetBrains service
 * and places a link to it to the services menu. Otherwise, returns
 * null.
 * @param {Object} item
 * @return {?string}
 */
var getServiceLogo = function(item) {
  var services = Object.keys(KnownService).slice(0);
  var service;
  var serviceName;
  var serviceRegExp;

  while ((service = services.shift())) {
    serviceName = KnownService[service];
    serviceRegExp = new RegExp(serviceName, 'i');

    if (serviceRegExp.test(item.applicationName) && VENDOR_REGEXP.test(item.vendor)) {
      return KnownServiceLogo[serviceName];
    }
  }

  return null;
};

/**
 * Takes a list of items and returns this list sorted by name
 * and applicationName.
 * @param {Array.<Object>} items
 * @return {Array.<Object>}
 */
var sortServices = function(items) {
  return items.sort(function(itemA, itemB) {
    var aApplicationName = itemA.applicationName || '';
    var bApplicationName = itemB.applicationName || '';

    return aApplicationName.localeCompare(bApplicationName) ||
           itemA.name.localeCompare(itemB.name);
  });
};


/**
 * @const
 * @type {number}
 */
var ELEMENT_WIDTH = 128; // todo(igor.alexeenko): Better get this property from css.

/**
 * @const
 * @type {number}
 */
var LINE_HEIGHT = 3 * Global.RING_UNIT;

/**
 * @const
 * @type {number}
 */
var ICON_LINE_HEIGHT = 18 * Global.RING_UNIT;

/**
 * @param {Header} headerElement
 * @return {number}
 */
var getHeaderHeight = function(headerElement) {
  var iconsMenuSize = headerElement.props.servicesList.length - headerElement.props.servicesListMenu.length;
  var headerWidth = headerElement.getDOMNode().clientWidth;

  var elementsPerLine = headerWidth / ELEMENT_WIDTH;
  var lines = Math.ceil(iconsMenuSize / elementsPerLine);

  var heights = [ICON_LINE_HEIGHT * lines];

  if (headerElement.props.servicesListMenu.length) {
    var lineMenuItems = headerElement.getDOMNode().querySelectorAll('.' + headerClassName.getElement('menu-service-line__item'));
    var lineWidth = [].reduce.call(lineMenuItems, function(accumulatedWidth, currentNode) {
      return accumulatedWidth + currentNode.clientWidth;
    }, lineMenuItems[0] ? lineMenuItems[0].clientWidth : 0);
    var linesCount = Math.ceil(lineWidth / headerWidth);

    heights.push(LINE_HEIGHT * linesCount);
  }

  return heights.reduce(function(a, b) { return a + b; }, 0);
};


/**
 * @type {function(Event):undefined}
 * @private
 */
var _servicesResizeHandler = null;

/**
 * @constructor
 * @extends {ReactComponent}
 * @example
  <example name="Header">
    <file name="index.html">
      <div class="popup-container"></div>
    </file>

    <file name="index.js" webpack="true">
      var React = require('react');
      var Header = require('./header.jsx');
      var Popup = require('../popup/popup.jsx');

      var headerContainer = document.createElement('div');
      document.body.appendChild(headerContainer);

      var popup, popupContainer;

      // Render youtrack header to DOM. Help link leads to Yandex.
      var header = React.renderComponent(new Header({
        helpLink: 'http://www.yandex.ru',
        logo: 'youtrack'
      }), headerContainer);

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

      header.setServicesList([
        { homeUrl: '#', name: 'Service 1', applicationName: 'youtrack' },
        { homeUrl: '#', name: 'Service 2', applicationName: 'teamcity' }
      ]);

      // Insert navigation.
      var navigation = document.createElement('div');
      navigation.innerHTML = 'Navigation';
      header.getMenuElement().appendChild(navigation);

      // Insert extra element to right menu.
      var extraElement = document.createElement('input');
      header.getExtraElement().appendChild(extraElement);
    </file>
  </example>
 */
var Header = React.createClass({
  getInitialState: function() {
    return {
      profilePicture: null,
      servicesOpened: false
    };
  },

  getDefaultProps: function() {
    return {
      helpLink: null,
      logo: '',
      menu: '',
      profilePopupData: null,
      rightMenu: '',
      servicesList: null,
      settingsLink: null,
      servicesIconsMenu: null,
      servicesListMenu: null,
      servicesListPopup: null,
      servicesStyle: null,
      servicesInnerStyle: null,

      onUserMenuOpen: null,
      onUserMenuClose: null,
      onSettingsOpen: null,
      onSettingsClose: null,
      onServicesOpen: null,
      onServicesClose: null
    };
  },

  render: function() {
    /*jshint ignore:start*/
    return (<div className={headerClassName.getClassName()}>
      <div className={headerClassName.getElement('logo')}>{this._getLogo()}</div>
      <div className={headerClassName.getElement('menu')}>{React.Children.map(this.props.menu, function(item) {
        item.props.className += ' ' + headerClassName.getElement('menu-item');
        return item;
      })}</div>
      {this._getRightMenu()}
      {this._getServicesMenu()}
    </div>);
    /*jshint ignore:end*/
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _onServicesOpen: function(evt) {
    if (this.props.onServicesOpen) {
      this.props.onServicesOpen();
      return;
    }

    if (this.props.servicesIconsMenu) {
      this.setState({ servicesOpened: true });
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

    if (this.props.servicesIconsMenu) {
      this.setState({ servicesOpened: false });
      return;
    }

    if (this.props.servicesListPopup) {
      this._setServicesPopupShown(false);
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (!this.state.servicesOpened && nextState.servicesOpened) {
      this._adjustServicesHeight(true);

      _servicesResizeHandler = function(event) {
        if (this.state.servicesOpened) {
          this._adjustServicesHeight(false);
        }
      }.bind(this);
      window.addEventListener('resize', _servicesResizeHandler);
    } else if (this.state.servicesOpened && !nextState.servicesOpened) {
      this._adjustServicesHeight(true, 0);

      window.removeEventListener('resize', _servicesResizeHandler);
      _servicesResizeHandler = null;
    }
  },

  /**
   * Resizes services list to a calculated or a given height.
   * @param {boolean=} animated
   * @param {number=} height
   * @private
   */
  _adjustServicesHeight: function(animated, height) {
    var headerHeight = typeof height !== 'undefined' ? height : getHeaderHeight(this);

    var servicesStyle = {};
    var servicesInnerStyle = {};

    servicesStyle['transition'] = !!animated ? 'height 200ms ease-out' : '';
    servicesStyle['height'] = headerHeight + 'px';

    servicesInnerStyle['height'] = headerHeight + 'px';

    this.setProps({
      servicesStyle: servicesStyle,
      servicesInnerStyle: servicesInnerStyle
    });
  },

  /**
   * Shows list of services.
   * @param {boolean} show
   * @private
   */
  _setServicesPopupShown: function(show) {
    if (show) {
      var popup = PopupMenu.renderComponent(new PopupMenu({
        anchorElement: this.refs['services'].getDOMNode(),
        autoRemove: true,
        corner: PopupMenu.PopupProps.Corner.BOTTOM_RIGHT,
        data: this.props.popupData,
        direction: PopupMenu.PopupProps.Directions.LEFT | PopupMenu.PopupProps.Directions.DOWN,
        onClose: function() {
          this.refs['services'].setOpened(false);
        }.bind(this)
      }));

      this.setProps({ servicesListPopup: popup });
    } else {
      this.props.servicesListPopup.remove();
      this.setProps({ servicesListPopup: null });
    }
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getLogo: function() {
    // todo(igor.alexeenko): This check treats as valid components only components
    // created by React.createClass(). If pass already existed component like
    // React.DOM.img it won't work.
    if (this.props.logo && typeof this.props.logo.setState !== 'undefined' &&
        typeof this.props.logo.render !== 'undefined') {
      return this.props.logo;
    }

    /* jshint ignore:start */
    return (<HeaderLogo glyph={this.props.logo} />);
    /* jshint ignore:end */
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
  _getServicesMenu: function() {
    if (!this.props.servicesList) {
      return null;
    }

    var className = React.addons.classSet(Global.createObject(
        headerClassName.getElement('menu-service'), true,
        headerClassName.getClassName('menu-service', 'opened'), this.state.servicesOpened));

    /* jshint ignore:start */
    return (<div className={className} style={this.props.servicesStyle}>
      <div className={headerClassName.getElement('menu-service-inner')} style={this.props.servicesInnerStyle}>
        {this.props.servicesIconsMenu}
      </div>
    </div>);
    /* jshint ignore:end */
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

    /* jshint ignore:start */
    var menuContent = this.props.rightMenu ? this.transferPropsTo(this.props.rightMenu) : (<div>
      <div className={extraElementClassName}></div>
      <MenuItem ref="settings" glyph="cog1" href={this.props.settingsLink} onOpen={this.props.onSettingsOpen} onClose={this.props.onSettingsClose} />
      <MenuItem ref="help" glyph="help" href={this.props.helpLink} />
      <MenuItem ref="services" glyph="expand1" onOpen={this._onServicesOpen} onClose={this._onServicesClose} />
      <MenuItem ref="userMenu" glyph="user1" onOpen={this.props.onUserMenuOpen} onClose={this.props.onUserMenuClose} />
    </div>);

    return (<div className={headerClassName.getElement('user-menu')}>{menuContent}</div>);
    /* jshint ignore:end */
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
    this.refs['userMenu'].setState({ picture: src });
  },

  /**
   * @param {string} href
   */
  setSettingsLink: function(href) {
    this.setProps({ settingsLink: href });
  },

  /**
   * @param {Array.<Object>} services
   */
  setServicesList: function(services) {
    this.setProps({ servicesList: services }, function() {
      var services = sortServices(this.props.servicesList.slice(0));
      var servicesIcons = [];
      var servicesList = [];

      services.forEach(function(item, i) {
        var serviceIcon = getServiceLogo(item);

        if (serviceIcon) {
          servicesIcons.push(item);
        } else {
          servicesList.push(item);
        }
      });

      if (servicesIcons.length > 1) {
        /* jshint ignore:start */
        var servicesIconsMenu = (<div>
          <div className={headerClassName.getElement('menu-service-line')}>
            {servicesList.map(function(item, i) {
              var href = document.location.toString().indexOf(item.homeUrl) === -1 ? item.homeUrl : null;
              var linkElement = href ? (<a href={item.homeUrl} target="_self">{item.name}</a>) : (<b>{item.name}</b>);

              return (<div className={headerClassName.getElement('menu-service-line__item')} key={i}>{linkElement}</div>)
            })}
          </div>
          {servicesIcons.map(function(item, i) {
            var serviceLogo = getServiceLogo(item);
            if (serviceLogo) {
              return (<a href={item.homeUrl} target="_self" title={item.name} key={i}>
                <div className={headerClassName.getElement('menu-service-item')}>
                  <Icon size={Icon.Size.Size64} glyph={serviceLogo} className="ring-icon" /><br />
                  {item.name}
                </div>
              </a>);
            }
          }, this)}
        </div>);

        this.setProps({
          servicesIconsMenu: servicesIconsMenu,
          servicesListMenu: servicesList
        });

        /* jshint ignore:end */
      } else {
        var popupData = this.props.servicesList.map(function(item) {
          return {
            href: item.homeUrl,
            label: item.name,
            type: PopupMenu.ListProps.Type.LINK
          };
        });

        this.setProps({ popupData: popupData });
      }
    });
  }
});


/**
 * @namespace
 */
var HeaderHelper = {};

/**
 * @param {Header} header
 * @param {Auth} auth
 * @param {Object=} params
 * @return {Promise}
 */
HeaderHelper.setServicesList = function(header, auth, params) {
  header.setProps({
    onServicesOpen: function() {
      header.refs['services'].setLoading(true);
    },

    onServicesClose: function() {
      header.refs['services'].setLoading(false);
    }
  });

  return auth.requestToken().then(function(token) {
    auth.getSecure('rest/services', token, params).then(function(resp) {
      if (resp.services) {
        header.setProps({
          onServicesOpen: null,
          onServicesClose: null
        });
        header.setServicesList(resp.services);

        if (header.refs['services'].state.loading) {
          header.refs['services'].setOpened(true);
          header.refs['services'].setLoading(false);
        }
      }
    });
  });
};

/**
 * @param {Header} header
 * @param {Auth} auth
 * @return {Promise}
 */
HeaderHelper.setUserMenu = function(header, auth) {
  var popup = null;
  var PopupMenu = require('popup-menu/popup-menu');

  return auth.requestUser().then(function(response) {
    if (response.avatar && response.avatar.type !== 'defaultavatar')  {
      header.setProfilePicture(response.avatar.pictureUrl);
    }

    var popupData = [
      { label: 'Profile', type: PopupMenu.ListProps.Type.LINK, href: [auth.config.serverUri, 'users/me'].join('') },
      { label: 'Logout', type: PopupMenu.ListProps.Type.LINK, onClick: function() { auth.logout(); } }
    ];

    header.setProps({
      profilePopupData: popupData,

      onUserMenuOpen: function() {
        popup = PopupMenu.renderComponent(new PopupMenu({
          anchorElement: header.refs['userMenu'].getDOMNode(),
          corner: PopupMenu.PopupProps.Corner.BOTTOM_RIGHT,
          data: header.props.profilePopupData,
          direction: PopupMenu.PopupProps.Directions.DOWN | PopupMenu.PopupProps.Directions.LEFT,
          onClose: function() {
            header.refs['userMenu'].setOpened(false);
          }
        }));
      },

      onUserMenuClose: function() {
        popup.remove();
        popup = null;
      }
    });
  });
};

module.exports = Header;
module.exports.HeaderHelper = HeaderHelper;
