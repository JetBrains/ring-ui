import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';
import './button.scss';

/**
 * @name Button
 * @constructor
 * @description Button component
 * @extends {ReactComponent}
 * @example
   <example name="Button">
     <file name="index.html">
       <div id="buttons">
         <style>#buttons > span {margin: 8px;}</style>
         <span id="button"></span><span id="button-icon"></span><span id="button-short"></span>
       </div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Button = require('ring-ui/components/button/button');

       render(Button.factory({}, 'Button default'), document.getElementById('button'));

       render(Button.factory({
         icon: require('jetbrains-icons/caret-down.svg')
       }, 'Button icon'), document.getElementById('button-icon'));

       render(Button.factory({
         short: true,
       }, '...'), document.getElementById('button-short'));

       var container = document.getElementById('buttons');
       ['active', 'blue', 'danger', 'delayed', 'loader', 'primary'].forEach(modifier => {
         var node = document.createElement('span');
         container.appendChild(node);

         render(Button.factory({
           [modifier]: true
         }, 'Button ' + modifier), node);
       });

   </file>
   </example>
 */
export default class Button extends RingComponent {
  static propTypes = {
    active: PropTypes.bool,
    blue: PropTypes.bool,
    danger: PropTypes.bool,
    delayed: PropTypes.bool,
    loader: PropTypes.bool,
    primary: PropTypes.bool,
    short: PropTypes.bool,

    icon: PropTypes.string,
    iconSize: PropTypes.number,
    className: PropTypes.string
  }

  render() {
    const {
      // Modifiers
      active,
      blue,
      danger,
      delayed,
      loader,
      primary,
      short,

      // Props
      icon,
      iconSize,
      className,
      children,
      ...props
    } = this.props;

    const classes = classNames(
      'ring-button',
      className, {
        'ring-button_default': !blue && !primary,
        'ring-button_active': active,
        'ring-button_blue': blue,
        'ring-button_danger': danger,
        'ring-button_delayed': delayed,
        'ring-button_icon': icon,
        'ring-button_loader': loader,
        'ring-button_primary': primary,
        'ring-button_short': short
      }
    );

    return (
      <button
        {...props}
        className={classes}
        tabIndex={loader ? -1 : 0}
      >
        <span className="ring-button__content">
          {children}
          {icon && (
            <span className="ring-button__icon">
              <Icon
                glyph={icon}
                size={iconSize || 16}
              />
            </span>
          )}
        </span>

        <span className="ring-button__loader"/>
      </button>
    );
  }
}
