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
      onOpen: null,
      onClose: null
    };
  },

  getInitialState: function () {
    return {
      opened: false,
      picture: null
    };
  },

  render: function () {
    /* jshint ignore:start */
    if (this.state.picture) {
      var baseClass = new Global.ClassName('ring-icon');
      var className = React.addons.classSet(Global.createObject(
          baseClass.getClassName(), true,
          baseClass.getModifier('16'), true,
          baseClass.getModifier(this.props.glyph), true,
          'header__user-menu-item_icon', true));

      return (<img
        className={className}
        src={this.state.picture}
        height="16"
        onClick={this._handleClick}
        width="16" />);
    }

    return (<Icon
      className="header__user-menu-item_icon"
      color={this.state.opened ? 'blue' : 'gray'}
      glyph={this.props.glyph}
      onClick={this._handleClick}
      size={Icon.Size.Size16} />);
    /* jshint ignore:end */
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleClick: function (evt) {
    evt.preventDefault();
    this.setOpened(!this.state.opened);
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
  }
});


/**
 * @constructor
 * @extends {ReactComponent}
 */
var Header = React.createClass({
  getInitialState: function() {
    return {
      profilePicture: null
    };
  },

  getDefaultProps: function() {
    return {
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
    return (<div className="header">
      <div className="header__logo">{this._getLogo()}</div>
      <div className="header__menu">{this.props.menu}</div>
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

    /* jshint ignore:start */
    var menuContent = this.props.rightMenu ? this.transferPropsTo(this.props.rightMenu) : (<div>
      <div className="header__user-menu-extra header__user-menu-item"></div>
      <MenuItem ref="settings" glyph="cog1" onOpen={this.props.onSettingsOpen} onClose={this.props.onSettingsClose} />
      <MenuItem ref="userMenu" glyph="user1" onOpen={this.props.onUserMenuOpen} onClose={this.props.onUserMenuClose} />
    </div>);

    return (<div className="header__user-menu">
      {menuContent}
    </div>);
    /* jshint ignore:end */
  },

  /**
   * @return {Element}
   */
  getExtraElement: function() {
    return this.getDOMNode().querySelector('.header__user-menu-extra');
  },

  /**
   * @return {Element}
   */
  getMenuElement: function() {
    return this.getDOMNode().querySelector('.header__menu');
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
