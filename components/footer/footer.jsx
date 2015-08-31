/**
 * @fileoverview Ring Footer.
 * @jsx React.DOM
 */

require('./footer.scss');
require('link/link.scss');

var React = require('react');
var Link = require('link/link');
var isArray = require('mout/lang/isArray');

/**
 * @enum {string}
 */
var Position = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var FooterColumn = React.createClass({
  propTypes: {
    position: React.PropTypes.string
  },

  render: function () {
    return (
      <div className={['ring-footer__column', 'ring-footer__column_' + this.props.position].join(' ')}>
        <ul className="ring-footer__column__i">
          {this.props.children}
        </ul>
      </div>
      );
  }
});

/**
 * Return copyright string
 * @param year {int}
 * @returns {string}
 */
var copyright = function(year) {
  var currentYear = (new Date()).getUTCFullYear();

  var ret = '© ';

  if (year >= currentYear) {
    ret += year;
  } else {
    ret += year + '—' + currentYear;
  }

  return ret;
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
var FooterLine = React.createClass({
  props: {
    item: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ])
  },
  render: function () {
    var items = isArray(this.props.item) ? this.props.item : [this.props.item];

    var renderItem = function(item, idx) {
      if (React.isValidComponent(item)) {
        return item;
      }

      var element = (item.copyright ? copyright(item.copyright) : '') + (item.label || item);

      if (item.url) {
        return <Link href={item.url} title={item.title}>{element}</Link>;
      }

      return element;
    };

    return (
      <li className="ring-footer__line">
        {items.map(renderItem)}
      </li>
    );
  }
});

/**
 * @name Footer
 * @constructor
 * @extends {ReactComponent}
 * @description
 *
 * This component defines the page footer.
 *
 * A footer consists of three sections, each optional:
 *  - left
 *  - center
 *  - right
 *
 * @param {string[]} className Additional classnames to component
 * @param {Object[]} left Left footer column elements
 * @param {Object[]} center Center footer column elements
 * @param {Object[]} right Right footer column elements
 * @returns {React} react component
 *
 * @example
   <example name="Footer">
   <file name="index.html">
   <div>
   <div id="footer"></div>
   </div>
   </file>
   <file name="index.js" webpack="true">
   var React = require('react');
   var Footer = require('footer/footer.jsx');
   React.renderComponent(
   Footer({
        className: 'stuff',
        left: [
          [{url: 'http://www.jetbrains.com/teamcity/?fromServer', label: 'TeamCity'}, ' by JetBrains'],
          'Enterprise 8.0.2 EAP (build 27448)'
        ],
        center: [
          [{copyright: 2000, label: ' JetBrains'}, ' · All rights reserved'],
          {url: 'http://teamcity.jetbrains.com/showAgreement.html', label: 'License agreement', title: 'READ ME!'}
        ],
        right: [
          {url: 'http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent', label: 'Feedback'}
        ]
      }), document.getElementById('footer'));
   </file>
   </example>
 */
var Footer = React.createClass({
  /** @override */
  propTypes: {
    className: React.PropTypes.string,
    left: React.PropTypes.array,
    center: React.PropTypes.array,
    right: React.PropTypes.array
  },

  render: function () {
    var content = function(elements, position) {
      return elements ? <FooterColumn key={position} position={position}>{elements.map(function(item, idx) {
        return <FooterLine key={idx} item={item} />;
      })}</FooterColumn> : false;
    };

    return (
      //TODO: pass classname property
      <div className={['ring-footer'].concat([this.props.className] || []).join(' ')}>
        {[content(this.props.left, Position.LEFT),
          content(this.props.center, Position.CENTER),
          content(this.props.right, Position.RIGHT)]}
      </div>
      );
  }
});

module.exports = Footer;
