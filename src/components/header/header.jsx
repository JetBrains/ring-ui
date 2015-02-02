/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./header.scss');
var Global = require('global/global');
var Icon = require('icon/icon'); // jshint -W098
var PopupMenu = require('popup-menu/popup-menu');
var React = require('react/addons');


/**
 * @type {Global.ClassName}
 * @private
 */
var headerClassName = new Global.ClassName('ring2-header');


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
      headerClassName.getClassName('user-menu-item', this.props.glyph), true));

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

  componentDidMount: function() {
    // NB! IE and Chrome 34 in Ubuntu doesn't bubble clicks on <use> element,
    // so we need to add a separate event handler for this case and prevent
    // bubbling from it.
    // todo(igor.alexeenko): Solid click handler on icons.
    var useElement = this.getDOMNode().querySelector('use');
    if (useElement) {
      useElement.addEventListener('click', this._handleUseClick);
    }
  },

  componentWillUnmount: function() {
    var useElement = this.getDOMNode().querySelector('use');
    if (useElement) {
      useElement.removeEventListener('click', this._handleUseClick);
    }
  },

  /**
   * @param {MouseEvent} evt
   * @private
   */
  _handleUseClick: function(evt) {
    if (!this.props.href) {
      evt.stopPropagation();
      this._handleClick(evt);
    }
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
    var baseClass = new Global.ClassName('ring-icon');
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

  setTitle: function(title) {
    this.setState({ title: title });
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

    if (serviceRegExp.test(item.name) && VENDOR_REGEXP.test(item.vendor)) {
      return KnownServiceLogo[serviceName];
    }
  }

  return null;
};

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
        { homeUrl: '#', name: 'Service 1' },
        { homeUrl: '#', name: 'Service 2' }
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
      rightMenu: '',
      servicesList: null,
      settingsLink: null,
      servicesIconsMenu: null,
      servicesListMenu: null,
      servicesListPopup: null,

      onUserMenuOpen: null,
      onUserMenuClose: null,
      onSettingsOpen: null,
      onSettingsClose: null
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
      <React.addons.CSSTransitionGroup transitionName={headerClassName.getElement('service-menu')}>
        {this._getServicesMenu()}
      </React.addons.CSSTransitionGroup>
    </div>);
    /*jshint ignore:end*/
  },

  /**
   * @param {SyntheticEvent} evt
   * @private
   */
  _onServicesOpen: function(evt) {
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
    if (this.props.servicesIconsMenu) {
      this.setState({ servicesOpened: false });
      return;
    }

    if (this.props.servicesListPopup) {
      this._setServicesPopupShown(false);
    }
  },

  /**
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
    if (!this.props.servicesList || !this.state.servicesOpened) {
      return null;
    }

    /* jshint ignore:start */
    return (<div className={headerClassName.getElement('menu-service')}>
      {this.props.servicesIconsMenu}
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
      var services = this.props.servicesList.slice(0);
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
        var servicesIconsMenu = (<div className={headerClassName.getElement('menu-service-inner')}>
          <div className={headerClassName.getElement('menu-service-line')}>
            {servicesList.map(function(item, i) {
              var href = document.location.origin.indexOf(item.homeUrl) === -1 ? item.homeUrl : null;
              var linkElement = href ? (<a href={item.homeUrl} target="_self">{item.name}</a>) : (<b>{item.name}</b>);

              return (<div className={headerClassName.getElement('menu-service-line__item')} key={i}>{linkElement}</div>)
            })}
          </div>
          {servicesIcons.map(function(item, i) {
            var serviceLogo = getServiceLogo(item);
            if (serviceLogo) {
              return (<div className={headerClassName.getElement('menu-service-item')} key={i}>
                <a href={item.homeUrl} target="_self">
                  <Icon size={Icon.Size.Size64} glyph={serviceLogo} className="ring-icon" /><br />
                  {item.name}
                </a>
              </div>);
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


module.exports = Header;
