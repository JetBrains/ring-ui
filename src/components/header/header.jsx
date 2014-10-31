/**
 * @fileoverview Cross-service universal header.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @jsx React.DOM
 */

require('./header.scss');
var Icon = require('icon/icon'); // jshint -W098
var React = require('react/addons');


/**
 * @constructor
 * @extends {ReactComponent}
 * @private
 */
var HeaderLogo = React.createClass({
  getDefaultProps: function() {
    return {
      glyph: ''
    };
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
 */
var Header = React.createClass({
  getDefaultProps: function() {
    return {
      logo: '',
      menu: '',
      rightMenu: ''
    };
  },

  render: function() {
    /*jshint ignore:start*/
    return (<div className="header">
      <div className="header__logo">{this._getLogo()}</div>
      <div className="header__menu">{this.props.menu}</div>
      <div className="header__user-menu">{this._getRightMenu()}</div>
    </div>);
    /*jshint ignore:end*/
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getLogo: function() {
    if (React.addons.TestUtils.isCompositeComponent(this.props.logo)) {
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

    return '';
  }
});


module.exports = Header;
