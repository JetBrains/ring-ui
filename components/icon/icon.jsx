/**
 * @fileoverview SVG icons component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 */

require('./icon.scss');
var ClassName = require('class-name/class-name');
var Global = require('global/global');
var React = require('react');
var iconUrl = require('./icon__url');
var classNames = require('classnames');

/**
 * Commonly used icon colors.
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
  Size12: 12,
  Size14: 14,
  Size16: 16,
  Size18: 18,
  Size32: 32,
  Size48: 48,
  Size64: 64,
  Size96: 96,
  Size128: 128
};

/**
 * @const
 * @type {string}
 */
var BASE_CLASS = 'ring-icon';

/**
 * @type {ClassName}
 */
var baseClass = new ClassName(BASE_CLASS);

/**
 * @type {Element}
 * @private
 */
var _templateElement = null;

/**
 * This is imperative that template element was first on the page.
 * If something else inserted before it in some browsers icons might
 * stop working.
 * @static
 */
function checkTemplatePositioning() {
  if (!_templateElement || !_templateElement.previousElementSibling) {
    return;
  }

  document.body.insertBefore(_templateElement, document.body.childNodes[0]);
}

/**
 * Inserts an SVG template into the document so icons could use links to those
 * elements.
 * @static
 */
function initializeTemplate() {
  if (_templateElement) {
    return;
  }

  var templateText = require('val?cacheable=true!./icon__template.js');
  var domParser = new DOMParser();
  var templateDoc = domParser.parseFromString(templateText, 'image/svg+xml');
  _templateElement = templateDoc.documentElement;

  document.body.insertBefore(_templateElement, document.body.childNodes[0]);
  _templateElement.style.display = 'none';
  _templateElement.id = baseClass.getElement('template');

  checkTemplatePositioning();
}

/**
 * @name Icon
 * @constructor
 * @description Icon component
 * @extends {ReactComponent}
 * @example
   <example name="Icon">
     <file name="index.html">
        <div id="some-icons">
           <span id="icon-container"></span>
           <span id="icon-distribution"></span>
           <span id="icon-16-pencil"></span>
           <span id="icon-14-pencil"></span>
        </div>
        <h3>All available icons are listed below. Place cursor over the icon to see it's name</h3>
        <div id="all-icons"></div>
     </file>

     <file name="index.scss">
       .ring-icon {
         margin: 8px;
         padding: 8px;

         &[class*=monochrome] {
           background: #24353D;
         }
       }
     </file>

     <file name="index.js" webpack="true">
       var Icon = require('./index.scss');
       var React = require('react');
       var Icon = require('icon/icon');

       React.render(React.createElement(Icon, {
         className: 'additional-class',
         color: 'orange',
         glyph: 'ok',
         size: Icon.Size.Size32
       }), document.getElementById('icon-container'));

       React.render(React.createElement(Icon, {
         glyph: 'distribution',
         size: Icon.Size.Size32
       }), document.getElementById('icon-distribution'));

       React.render(React.createElement(Icon, {
         glyph: 'pencil',
         size: Icon.Size.Size16
       }), document.getElementById('icon-16-pencil'));

       React.render(React.createElement(Icon, {
         glyph: 'pencil',
         size: Icon.Size.Size14
       }), document.getElementById('icon-14-pencil'));

       function getIconNames(){
          var symbolsContainer = document.getElementById('ring-icon__template');
          var symbols = symbolsContainer.querySelectorAll('symbol');
          return Array.prototype.map.call(symbols, function(symbolElement){
            return symbolElement.id.replace('ring-icon_', '');
          });
       }

       var icons = getIconNames();

       React.render(React.DOM.div({
         children: icons.map(function (icon) {
           return React.createElement(Icon, {
             glyph: icon,
             title: icon
           });
         })
       }), document.getElementById('all-icons'));
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
      baseClass: baseClass,
      className: '',
      color: Color.DEFAULT,
      glyph: '',
      size: Size.Size32,
      title: ''
    };
  },

  render: function () {
    var classes = classNames(
      Global.createObject(
        this.props.baseClass.getModifier(this.props.size), true,
        this.props.baseClass.getModifier(this.props.color), !!this.props.color,
        this.props.baseClass.getModifier(this.props.glyph), !!this.props.glyph,
        this.props.baseClass.getClassName(), true
      ),
      this.props.className
    );

    var xlinkHref = '#' + this.props.baseClass.getModifier(this.props.glyph);
    xlinkHref = iconUrl.resolve(xlinkHref);

    return (
      <span {...this.props} className={classes}>
        <svg className={this.props.baseClass.getElement('i')} title={this.props.title} dangerouslySetInnerHTML={{__html: '<use xlink:href="' + xlinkHref + '"></use>'}}/>
      </span>
    );
  },

  componentDidMount: function() {
    initializeTemplate();
    checkTemplatePositioning();
  }
});

/** @type {Icon} */
module.exports = Icon;
