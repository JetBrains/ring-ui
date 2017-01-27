/**
 * @name Icon
 * @category Components
 * @constructor
 * @description Displays an icon.
 * @extends {ReactComponent}
 * @example-file ./icon.examples.html
 */

import 'core-js/modules/es6.array.find';
import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import urlUtils from '../global/url';

import {Color, Size} from './icon__constants';
import './icon.scss';

export default class Icon extends RingComponent {
  static propTypes = {
    color: PropTypes.string,
    glyph: PropTypes.string,
    size: PropTypes.number
  };

  static defaultProps = ({
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
    const {className, size, color, glyph, width, height, activeColor, activeEvent, hoverColor, ...restProps} = this.props;
    const currentColor = this.state.color || color;

    const classes = classNames(
      {
        'ring-icon': true,
        [`ring-icon_${currentColor}`]: !!currentColor
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
          className={'ring-icon__i'}
          style={style}
        >
          <use xlinkHref={xlinkHref}/>
        </svg>
      </span>
    );
  }
}
