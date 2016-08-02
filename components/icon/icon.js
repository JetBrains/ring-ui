/**
 * @fileoverview SVG icons component.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 */

import 'core-js/modules/es6.array.find';
import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import urlUtils from '../url-utils/url-utils';
import ClassName from '../class-name/class-name';

import {Color, Size} from './icon__constants';
import './icon.scss';

/**
 * @name Icon
 * @constructor
 * @description Icon component
 * @extends {ReactComponent}
 * @example
   <example name="Icon">
     <file name="index.html">
        <div id="some-icons">
           <span id="icon-active"></span>
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
       var Icon = require('ring-ui/components/icon/icon');

       render(Icon.factory({
         glyph: require('jetbrains-icons/distribution.svg'),
         size: Icon.Size.Size32,
         activeColor: Icon.Color.BLUE,
         hoverColor: Icon.Color.ORANGE,
         onClick: function() {
          return new Promise(resolve => setTimeout(resolve, 3000));
         }
       }), document.getElementById('icon-active'));

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
       @import '~ring-ui/components/global/global';

       .ring-icon {
         margin: 8px;
         padding: 8px;
         color: $ring-link-color;
       }
     </file>

     <file name="index.js" webpack="true">
       require('./index.scss');
       import {render} from 'react-dom';
       import {createElement} from 'react';
       import Icon from 'ring-ui/components/icon/icon';

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
     import Icon from 'ring-ui/components/icon/icon';

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
    baseClass: new ClassName('ring-icon'),
    activeEvent: 'onClick',
    className: '',
    color: Color.DEFAULT,
    glyph: '',
    size: Size.Size32
  });

  state = {};

  static Color = Color;
  static Size = Size;

  render() {
    const {baseClass, className, size, color, glyph, width, height, activeColor, activeEvent, hoverColor, ...restProps} = this.props;
    const currentColor = this.state.color || color;

    const classes = classNames(
      {
        [baseClass.getModifier(currentColor)]: !!currentColor,
        [baseClass.getClassName()]: true
      },
      className
    );

    const style = width || height ? {width, height} : {
      width: size,
      height: size
    };

    const xlinkHref = urlUtils.resolveRelativeURL(glyph);
    const activeEventHandler = restProps[activeEvent];

    if (activeColor && typeof activeEventHandler === 'function') {
      restProps[activeEvent] = (...args) => {
        if (this.node) {
          this.setState({
            color: activeColor,
            isActive: true
          });
        }

        const promise = Promise.resolve(activeEventHandler(...args));

        promise.then(() => {
          if (this.node) {
            this.setState({
              color: Color.DEFAULT,
              isActive: false
            });
          }
        });

        return promise;
      };
    }

    let onMouseOver;
    let onMouseOut;

    if (hoverColor && !this.state.isActive) {
      onMouseOver = () => {
        this.setState({
          color: hoverColor,
          isHovered: true
        });
      };
    }

    if (this.state.isHovered && !this.state.isActive) {
      onMouseOut = () => {
        this.setState({
          color: Color.DEFAULT,
          isHovered: false
        });
      };
    }

    return (
      <span
        {...restProps}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        className={classes}
      >
        <svg
          className={baseClass.getElement('i')}
          style={style}
        >
          <use xlinkHref={xlinkHref}/>
        </svg>
      </span>
    );
  }
}
