/**
 * @fileoverview SVG-Icon component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 * @jsx React.DOM
 */

'use strict';

require('./icon.scss');
var Global = require('global/global'); // jshint -W098
var React = require('react');


/**
 * Commonly used colors of icons.
 * @enum {string}
 */
var Color = {
  DEFAULT: '',
  GRAY: 'light-gray',
  GREEN: 'green',
  ORANGE: 'orange',
  RED: 'red',
  BLUE: 'blue'
};


/**
 * @enum {number}
 */
var Size = {
  Size16: 16,
  Size32: 32,
  Size64: 64,
  Size128: 128
};


/**
 * @const
 * @type {string}
 */
var BASE_CLASS = 'ring-icon';


/**
 * @type {Element}
 * @private
 */
var _templateElement = null;


/**
 * XML namespaces of SVG-elements and their attributes.
 * @enum {string}
 */
var NamespaceURI = {
  SVG: 'http://www.w3.org/2000/svg',
  XLINK: 'http://www.w3.org/1999/xlink'
};


/**
 * Inserts an svg template into a document so icons could use links to this
 * elements. Exported as a static method so could be used apart from component.
 * @static
 */
var initializeTemplate = function() {
  if (_templateElement) {
    return;
  }

  var templateText = require('val!./icon__template.js');
  var domParser = new DOMParser();
  var templateDoc = domParser.parseFromString(templateText, 'image/svg+xml');
  _templateElement = templateDoc.documentElement;

  document.body.insertBefore(_templateElement, document.body.childNodes[0]);
  _templateElement.style.display = 'none';
};


/**
 * @constructor
 * @extends {ReactComponent}
 * @example
 * <example>
 *   <div class="icon-container"></div>
 *
 *   <script>
 *     var Icon = require('icon/icon');
 *
 *     React.renderComponent(<Icon className="additional-class" color="orange" glyph="ok" size={Icon.Size.Size32} />,
 *         document.querySelector('.icon-container'));
 *   </script>
 * </example>
 */
var Icon = React.createClass({
  statics: {
    Color: Color,
    initializeTemplate: initializeTemplate,
    Size: Size
  },

  propTypes: {
    color: React.PropTypes.string,
    glyph: React.PropTypes.string,
    size: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      className: '',
      color: Color.DEFAULT,
      glyph: '',
      size: Size.Size32
    };
  },

  render: function () {
    /* jshint ignore:start */
    var classList = React.addons.classSet(Global.createObject(
        BASE_CLASS, true,
        BASE_CLASS + '_' + this.props.size, true,
        this._getColorClass(), !!this.props.color,
        this._getID(), !!this.props.modifier));

    return this.transferPropsTo(<svg className={classList} />);
    /* jshint ignore:end */
  },

  componentDidMount: function() {
    initializeTemplate();

    var useElement = document.createElementNS(NamespaceURI.SVG, 'use');
    useElement.setAttributeNS(NamespaceURI.XLINK, 'xlink:href', '#' + this._getID());

    this.getDOMNode().appendChild(useElement);
  },

  // todo(igor.alexeenko): We need a tool for BEM classes as soon as possible.

  /**
   * @return {string}
   * @private
   */
  _getColorClass: function() {
    return BASE_CLASS + '_' + this.props.color;
  },

  /**
   * @return {string}
   * @private
   */
  _getID: function() {
    return BASE_CLASS + '_' + this.props.glyph;
  }
});

/** @type {Icon} */
module.exports = Icon;
