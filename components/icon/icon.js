/**
 * @name Icon
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays an icon.
 * @extends {ReactComponent}
 * @example-file ./icon.examples.html
 */

import 'core-js/modules/es6.array.find';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {resolveRelativeURL} from '../global/url';

import {Color, Size} from './icon__constants';
import './icon.scss';

export default class Icon extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    height: PropTypes.number,
    size: PropTypes.number,
    width: PropTypes.number
  };

  static defaultProps = ({
    className: '',
    color: Color.DEFAULT,
    glyph: '',
    size: Size.Size32
  });

  static Color = Color;
  static Size = Size;

  render() {
    const {className, size, color, glyph, width, height, ...restProps} = this.props;

    const classes = classNames(
      {
        'ring-icon': true,
        [`ring-icon_${color}`]: !!color
      },
      className
    );

    const style = (width || height)
      ? {width, height}
      : {
        width: size,
        height: size
      };

    const xlinkHref = resolveRelativeURL(glyph);

    return (
      <span
        {...restProps}
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

export {Size};

export function iconHOC(glyph, displayName) {
  // eslint-disable-next-line react/no-multi-comp
  return class BoundIcon extends PureComponent {
    static displayName = displayName;

    static propTypes = {
      iconRef: PropTypes.func
    };

    static Color = Color;
    static Size = Size;

    static toString() {
      return glyph;
    }

    render() {
      const {iconRef, ...restProps} = this.props;
      return <Icon ref={iconRef} {...restProps} glyph={glyph}/>;
    }
  };
}
