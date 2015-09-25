/**
 * @fileoverview SVG icons component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 * @jsx React.DOM
 */

require('./icon.scss');
var ClassName = require('class-name/class-name');
var Global = require('global/global');
var React = require('react/addons');
var iconUrl = require('./icon__url');


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
 * Inserts an SVG template into the document so icons could use links to those
 * elements.
 * @static
 */

/**
 * @name Icon
 * @constructor
 * @description Icon component settings
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
     </file>

     <file name="index.scss">
       .ring-icon {
         margin: 8px;
         padding: 8px;
       }
     </file>

     <file name="index.js" webpack="true">
       require('./index.scss');
       var React = require('react');
       var Icon = require('icon/icon');

       React.renderComponent(Icon({
         className: 'additional-class',
         color: 'orange',
         glyph: require('icon/source/ok.svg'),
         size: Icon.Size.Size32
       }), document.getElementById('icon-container'));

       React.renderComponent(Icon({
         glyph: require('icon/source/distribution.svg'),
         size: Icon.Size.Size32
       }), document.getElementById('icon-distribution'));

       React.renderComponent(Icon({
         glyph: require('icon/source/pencil.svg'),
         size: Icon.Size.Size16
       }), document.getElementById('icon-16-pencil'));

       React.renderComponent(Icon({
         glyph: require('icon/source/pencil.svg'),
         size: Icon.Size.Size14
       }), document.getElementById('icon-14-pencil'));
     </file>
   </example>

 * @example
   <example name="Icons list">
     <file name="index.html">
       <h3>All available icons are listed below. Place cursor over the icon to see it's name</h3>
       <div id="all-icons"></div>
     </file>

     <file name="index.scss">
     .ring-icon {
             margin: 8px;
             padding: 8px;
           }
     </file>

     <file name="index.js" webpack="true">
       require('./index.scss');
       var React = require('react');
       var Icon = require('icon/icon');

       var icons = require.context('icon/source', false, /\.svg$/);

       React.renderComponent(React.DOM.div({
               children: icons.keys().map(icons).map(function (icon) {
                 return Icon({
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
      size: Size.Size32
    };
  },

  render: function () {
    var classList = React.addons.classSet(Global.createObject(
        this.props.baseClass.getModifier(this.props.size), true,
        this.props.baseClass.getModifier(this.props.color), !!this.props.color,
        this.props.baseClass.getModifier(this.props.glyph), !!this.props.glyph,
        this.props.baseClass.getClassName(), true));

    var xlinkHref = iconUrl.resolve('#' + this.props.glyph);

    return (this.transferPropsTo(<span className={classList}>
      <svg className={this.props.baseClass.getElement('i')} dangerouslySetInnerHTML={{__html: '<use xlink:href="' + xlinkHref + '"></use>'}}/>
    </span>));
  }
});

/** @type {Icon} */
module.exports = Icon;
