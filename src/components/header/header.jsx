/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./header.scss');
var Global = require('global/global');
var Icon = require('icon/icon'); // jshint -W098
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
    var menuElement = (<span className={className} onClick={this._handleClick}>
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
  _handleClick: function (evt) {
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
        size={Icon.Size.Size16}
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
 * @constructor
 * @extends {ReactComponent}
 * @example
 * <example>
 *   <div class="header-container"></div>
 *   <div class="popup-container"></div>
 *   <script>
 *     var popup;
 *     var popupContainer = document.querySelector('.popup-container');
 *
 *     // Render youtrack header to DOM. Help link leads to Yandex.
 *     var header = React.renderComponent(new ring.Header({
 *       helpLink: 'http://www.yandex.ru',
 *       logo: 'youtrack'
 *     }, document.querySelector('.header-container'));
 *
 *     // Add callbacks for opening and closing settings element.
 *     header.setProps({
 *       onSettingsOpen: function() {
 *         popup = React.renderComponent(
 *             new ring.Popup({ anchor: header.getSettings().getDOMNode() }),
 *             popupContainer)
 *       },
 *
 *       onSettingsClose: function() {
 *         React.unmountComponentAtNode(popupContainer);
 *         popup = null;
 *       }
 *     });
 *
 *     // Insert navigation.
 *     var navigation = document.createElement('div');
 *     navigation.innerHTML = 'Navigation';
 *     header.getMenuElement().appendChild(navigation);
 *
 *     // Insert extra element to right menu.
 *     var extraElement = document.createElement('input');
 *     header.getExtraElement().appendChild(extraElement);
 *   </script>
 * </example>
 */
var Header = React.createClass({
  getInitialState: function() {
    return {
      profilePicture: null
    };
  },

  getDefaultProps: function() {
    return {
      helpLink: null,
      logo: '',
      menu: '',
      rightMenu: '',

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
      <div className={headerClassName.getElement('menu')}>{this.props.menu}</div>
      {this._getRightMenu()}
    </div>);
    /*jshint ignore:end*/
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
      <MenuItem ref="help" glyph="help" href={this.props.helpLink} />
      <MenuItem ref="settings" glyph="cog1" onOpen={this.props.onSettingsOpen} onClose={this.props.onSettingsClose} />
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
  }
});


module.exports = Header;
