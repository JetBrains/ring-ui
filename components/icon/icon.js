/**
 * @fileoverview SVG icons component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import IconUrl from './icon__url';
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
  Size40: 40,
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
           <span id="icon-custom-search-error"></span>
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

       var render = require('react-dom').render;
       var Icon = require('icon/icon');

       render(Icon.factory({
         className: 'additional-class',
         color: 'orange',
         glyph: require('jetbrains-icons/ok.svg'),
         size: Icon.Size.Size32
       }), document.getElementById('icon-container'));

       render(Icon.factory({
         glyph: require('jetbrains-icons/distribution.svg'),
         size: Icon.Size.Size32
       }), document.getElementById('icon-distribution'));

       render(Icon.factory({
         glyph: require('jetbrains-icons/pencil.svg'),
         size: Icon.Size.Size16
       }), document.getElementById('icon-16-pencil'));

       render(Icon.factory({
         glyph: require('jetbrains-icons/pencil.svg'),
         size: Icon.Size.Size14
       }), document.getElementById('icon-14-pencil'));

       render(Icon.factory({
         glyph: require('jetbrains-icons/search-error.svg'),
         height: 80,
         width: 100
       }), document.getElementById('icon-custom-search-error'));
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
       import {render} from 'react-dom';
       import {createElement} from 'react';
       import Icon from 'icon/icon';

       var icons = require.context('jetbrains-icons', false, /\.svg$/);

       render(createElement('div', {
         children: icons.keys().map(icons).map(function (icon) {
           return Icon.factory({
             glyph: icon,
             title: icon
           });
         })
       }), document.getElementById('all-icons'));
     </file>
   </example>

   * @example
   <example name="JB logos list">
   <file name="index.html">
     <div id="logos"></div>
   </file>

   <file name="index.scss">
     .ring-icon {
       margin: 8px;
       padding: 8px;
     }
   </file>

   <file name="index.js" webpack="true">
     require('./index.scss');
     import {render} from 'react-dom';
     import {createElement} from 'react';
     import Icon from 'icon/icon';

     var logos = require.context('jetbrains-logos', true, /\.svg$/);

     render(createElement('div', {
       children: logos.keys().map(logos).map(function (icon) {
         return Icon.factory({
           glyph: icon,
           title: icon,
           size: Icon.Size.Size128
         });
       })
     }), document.getElementById('logos'));
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
    size: Size.Size32
  });

  static Color = Color;
  static Size = Size;

  render() {
    let {baseClass, className, size, color, glyph, width, height} = this.props;

    let classes = classNames(
      {
        [baseClass.getModifier(size)]: true,
        [baseClass.getModifier(color)]: !!color,
        [baseClass.getClassName()]: true
      },
      className
    );

    const style = width || height ? {width, height} : {
      width: size,
      height: size
    };

    const xlinkHref = IconUrl.resolve(glyph);

    return (
      <span {...this.props} className={classes}>
        <svg
          className={baseClass.getElement('i')}
          style={style}
          dangerouslySetInnerHTML={{__html: '<use xlink:href="' + xlinkHref + '"></use>'}}
        />
      </span>
    );
  }
}
