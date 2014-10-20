/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./header.scss');
var Auth = require('auth/auth'); // jshint -W098
var Global = require('global/global');
var Icon = require('icon/icon');
var React = require('react/addons');


/**
 * @enum {string}
 */
var Service = {
  TEAMCITY: 'teamcity',
  YOUTRACK: 'youtrack'
};


/**
 * @type {Object.<Service, string>}
 */
var serviceToIcon = Global.createObject(
    Service.TEAMCITY, 'ban-circle',
    Service.YOUTRACK, 'eye');



/**
 * @constructor
 * @extends {ReactComponent}
 */
var Header = React.createClass({
  statics: { Service: Service },

  propTypes: {
    service: React.PropTypes.oneOf(Object.keys(Service).map(function(name) {
      return Service[name];
    })).isRequired,
    menuItems: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps: function() {
    return {
      service: Service.YOUTRACK,
      menuItems: [
        { name: 'Users', link: '' },
        { name: 'Groups', link: '' },
        { name: 'Spaces', link: '' },
        { name: 'Services', link: '' }
      ]
    };
  },

  getInitialState: function() {
    return {
      menuIsOpened: false
    };
  },

  render: function() {
    /*jshint ignore:start*/
    return (<div className="header">
      <div className="header__logo">{this._getLogo()}</div>
      {this._getMenu()}
      {this._getUserMenu()}
      <React.addons.CSSTransitionGroup transitionName="service-menu">
        {this._getServiceMenu()}
      </React.addons.CSSTransitionGroup>
    </div>);
    /*jshint ignore:end*/
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getLogo: function() {
    return new Icon({
      glyph: serviceToIcon[this.props.service],
      size: Icon.Size.Size32
    });
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getMenu: function() {
    /* jshint ignore:start */
    return /** @type {ReactComponent} */ (<div className="header__menu">{this.props.menuItems.map(function(item, i) {
      return (<div className="header__menu-item" key={i}><a href={item.link}>{item.name}</a></div>);
    })}</div>);
    /* jshint ignore:end */
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getUserMenu: function() {
    return /** @type {ReactComponent} */ new UserMenu({
      menuOpenCallback: function() {
        this.setState({ menuIsOpened: !this.state.menuIsOpened });
      }.bind(this)
    });
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getServiceMenu: function() {
    if (this.state.menuIsOpened) {
      /* jshint ignore:start */
      return (<div className="header__menu-service">
        <div className="header__menu-service-inner">
          <div className="header__menu-service-item"><a href="#"><Icon glyph="ok" size={Icon.Size.Size48} /><br />YouTrack</a></div>
          <div className="header__menu-service-item"><a href="#"><Icon glyph="eye" size={Icon.Size.Size48} /><br />TeamCity</a></div>
          <div className="header__menu-service-item"><a href="#"><Icon glyph="cog" size={Icon.Size.Size48} /><br />Hub</a></div>
          <div className="header__menu-service-item"><a href="#"><Icon glyph="global" size={Icon.Size.Size48} /><br />Upsource</a></div>
        </div>
      </div>);
      /* jshint ignore:end */
    }

    return null;
  }
});



/**
 * @constructor
 * @extends {ReactComponent}
 * @private
 */
var UserMenu = React.createClass({
  getInitialState: function() {
    return {
      menuIsOpened: false
    };
  },

  render: function() {
    /* jshint ignore:start */
    return (<div className="header__user-menu">
      <Icon className="header__user-menu-item_icon header__user-menu-item" color={Icon.Color.WHITE} onClick={this._handleItemClick} glyph="cog" size={Icon.Size.Size16} />
      <Icon className="header__user-menu-item_icon header__user-menu-item" color={Icon.Color.WHITE} onClick={this._handleItemClick} glyph="help" size={Icon.Size.Size16} />
      <Icon className="header__user-menu-item_icon header__user-menu-item" color={Icon.Color.WHITE} onClick={this._handleMenuClick} glyph="menu" size={Icon.Size.Size16} />
      <Icon className="header__user-menu-item_icon header__user-menu-item" color={Icon.Color.WHITE} onClick={this._handleItemClick} glyph="user" size={Icon.Size.Size16} />
    </div>);
    /* jshint ignore:end */
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleItemClick: function(evt) {
    evt.preventDefault();
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleMenuClick: function(evt) {
    evt.preventDefault();

    this.setState({ menuIsOpened: true });
    this.props.menuOpenCallback();
  }
});


module.exports = Header;
