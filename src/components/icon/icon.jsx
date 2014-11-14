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
  BLUE: 'blue',
  DEFAULT: '',
  GRAY: 'light-gray',
  GREEN: 'green',
  ORANGE: 'orange',
  RED: 'red',
  WHITE: 'white'
};


/**
 * @enum {number}
 */
var Size = {
  Size16: 16,
  Size32: 32,
  Size48: 48,
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
      baseClass: new Global.ClassName(BASE_CLASS),
      className: '',
      color: Color.DEFAULT,
      glyph: '',
      size: Size.Size32
    };
  },

  render: function () {
    /* jshint ignore:start */
    var classList = React.addons.classSet(Global.createObject(
        this.props.baseClass.getModifier(this.props.size), true,
        this.props.baseClass.getModifier(this.props.color), !!this.props.color,
        this.props.baseClass.getModifier(this.props.glyph), !!this.props.glyph,
        this.props.baseClass.getClassName(), true));

    return this.transferPropsTo(<svg className={classList} />);
    /* jshint ignore:end */
  },

  componentDidMount: function() {
    initializeTemplate();

    var useElement = document.createElementNS(NamespaceURI.SVG, 'use');
    useElement.setAttributeNS(NamespaceURI.XLINK, 'xlink:href',
        '#' + this.props.baseClass.getModifier(this.props.glyph));

    this.getDOMNode().appendChild(useElement);
  }
});

/** @type {Icon} */
module.exports = Icon;
