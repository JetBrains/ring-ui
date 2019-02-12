/**
 * @name Icon
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays an icon.
 * @extends {ReactComponent}
 * @example-file ./icon.examples.html
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import {Color, Size} from './icon__constants';
import styles from './icon.css';

export default class Icon extends PureComponent {
  static Color = Color;
  static Size = Size;

  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    height: PropTypes.number,
    size: PropTypes.number,
    width: PropTypes.number,
    loading: PropTypes.bool
  };

  static defaultProps = ({
    className: '',
    color: Color.DEFAULT,
    glyph: '',
    size: Size.Size16
  });

  render() {
    const {className, size, color, loading, glyph, width, height, ...restProps} = this.props;

    const classes = classNames(styles.icon,
      {
        [styles[color]]: !!color,
        [styles.loading]: loading
      },
      className
    );

    const style = (width || height)
      ? {width, height}
      : {
        width: size,
        height: size
      };

    return (
      <span
        {...restProps}
        className={classes}
      >
        <InlineSVG
          raw
          src={glyph.call ? String(glyph) : glyph}
          className={styles.glyph}
          style={style}
        />
      </span>
    );
  }
}

export {Size};

export function iconHOC(glyph, displayName) {
  // eslint-disable-next-line react/no-multi-comp
  return class BoundIcon extends PureComponent {
    static Color = Color;
    static Size = Size;

    static toString() {
      return glyph;
    }

    static displayName = displayName;

    static propTypes = {
      iconRef: PropTypes.func
    };

    render() {
      const {iconRef, ...restProps} = this.props;
      return <Icon ref={iconRef} {...restProps} glyph={glyph}/>;
    }
  };
}
