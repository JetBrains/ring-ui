/**
 * @fileoverview SVG icons component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import iconUrl from './icon__url';
import ClassName from 'class-name/class-name';
import './icon.scss';

/**
 * Commonly used icon colors.
 * @enum {string}
 */
const Color = {
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
const Size = {
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
 * @type {ClassName}
 */
const baseClass = new ClassName('ring-icon');

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
       require('./index.scss');

       var render = require('react-dom').render;
       var DOM = require('react').DOM;
       var Icon = require('icon/icon');

       render(Icon.factory({
         className: 'additional-class',
         color: 'orange',
         glyph: 'ok',
         size: Icon.Size.Size32
       }), document.getElementById('icon-container'));

       render(Icon.factory({
         glyph: 'distribution',
         size: Icon.Size.Size32
       }), document.getElementById('icon-distribution'));

       render(Icon.factory({
         glyph: 'pencil',
         size: Icon.Size.Size16
       }), document.getElementById('icon-16-pencil'));

       render(Icon.factory({
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

       render(DOM.div({
         children: icons.map(function (icon) {
           return Icon.factory({
             glyph: icon,
             title: icon
           });
         })
       }), document.getElementById('all-icons'));
     </file>
   </example>
 */
export default class Icon extends RingComponent {
  static propTypes = {
    color: PropTypes.string,
    glyph: PropTypes.string,
    size: PropTypes.number
  };

  static defaultProps = ({
    baseClass: baseClass,
    className: '',
    color: Color.DEFAULT,
    glyph: '',
    size: Size.Size32,
    title: ''
  });

  static Color = Color;
  static Size = Size;

  /**
   * @type {Element}
   * @private
   */
  static _templateElement = null;

  /**
   * This is imperative that template element was first on the page.
   * If something else inserted before it in some browsers icons might
   * stop working.
   * @static
   */
  static checkTemplatePositioning() {
    if (!Icon._templateElement || !Icon._templateElement.previousElementSibling) {
      return;
    }

    document.body.insertBefore(Icon._templateElement, document.body.childNodes[0]);
  }

  /**
   * Inserts an SVG template into the document so icons could use links to those
   * elements.
   * @static
   */
  static initializeTemplate() {
    if (Icon._templateElement) {
      return;
    }

    let templateText = require('val?cacheable=true!./icon__template.js');
    let domParser = new DOMParser();
    let templateDoc = domParser.parseFromString(templateText, 'image/svg+xml');
    Icon._templateElement = templateDoc.documentElement;

    document.body.insertBefore(Icon._templateElement, document.body.childNodes[0]);
    Icon._templateElement.style.display = 'none';
    Icon._templateElement.id = baseClass.getElement('template');

    Icon.checkTemplatePositioning();
  }

  render() {
    let {baseClass, className, size, color, glyph, title} = this.props;

    let classes = classNames(
      {
        [baseClass.getModifier(size)]: true,
        [baseClass.getModifier(color)]: !!color,
        [baseClass.getModifier(glyph)]: !!glyph,
        [baseClass.getClassName()]: true
      },
      className
    );

    let xlinkHref = '#' + baseClass.getModifier(glyph);
    xlinkHref = iconUrl.resolve(xlinkHref);

    return (
      <span {...this.props} className={classes}>
        <svg
          className={baseClass.getElement('i')}
          title={title}
          dangerouslySetInnerHTML={{__html: '<use xlink:href="' + xlinkHref + '"></use>'}}
        />
      </span>
    );
  }

  didMount() {
    Icon.initializeTemplate();
    Icon.checkTemplatePositioning();
  }
}
