/**
 * @fileoverview SVG-Icon component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 * @jsx React.DOM
 */

'use strict';

require('./icon.scss');
var Global = require('global/global'); // jshint -W098
var React = require('react/addons');
var iconUrl = require('./icon__url');


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
  Size14: 14,
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
 * @name Icon
 * @constructor
 * @description Icon component
 * @extends {ReactComponent}
 * @example
   <example name="Icon">
     <file name="index.html">
        <span id="icon-container"></span>
        <span id="icon-distribution"></span>
        <span id="icon-16-pencil"></span>
        <span id="icon-14-pencil"></span>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var Icon = require('./icon.jsx');

       React.renderComponent(Icon({
         className: 'additional-class',
         color: 'orange',
         glyph: 'ok',
         size: Icon.Size.Size32
       }), document.getElementById('icon-container'));

       React.renderComponent(Icon({
         glyph: 'distribution',
         size: Icon.Size.Size32
       }), document.getElementById('icon-distribution'));

       React.renderComponent(Icon({
         glyph: 'pencil',
         size: Icon.Size.Size16
       }), document.getElementById('icon-16-pencil'));

       React.renderComponent(Icon({
         glyph: 'pencil',
         size: Icon.Size.Size14
       }), document.getElementById('icon-14-pencil'));
     </file>
   </example>
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
      size: Size.Size32,
      title: ''
    };
  },

  render: function () {
    /* jshint ignore:start */
    var classList = React.addons.classSet(Global.createObject(
        this.props.baseClass.getModifier(this.props.size), true,
        this.props.baseClass.getModifier(this.props.color), !!this.props.color,
        this.props.baseClass.getModifier(this.props.glyph), !!this.props.glyph,
        this.props.baseClass.getClassName(), true));

    var xlinkHref = '#' + this.props.baseClass.getModifier(this.props.glyph);
    xlinkHref = iconUrl.resolve(xlinkHref);

    return this.transferPropsTo(
        <svg className={classList}
             title={this.props.title}
             dangerouslySetInnerHTML={{__html: '<use xlink:href="' + xlinkHref + '"></use>'}}/>);
    /* jshint ignore:end */
  },

  componentDidMount: function() {
    initializeTemplate();
  }
});

/** @type {Icon} */
module.exports = Icon;
