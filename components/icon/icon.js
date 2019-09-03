/**
 * @name Icon
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import {Color, Size} from './icon__constants';
import styles from './icon.css';

const warnSize = deprecate(
  () => {},
  `\`size\`, \`width\` and \`height\` props are not recommended to use in Ring UI \`Icon\` component. The intrinsic sizes of SVG icon (\`width\` and \`height\` SVG attributes) are used instead.

We strongly recommend to use icons handcrafted for particular sizes. If your icon doesn't exist in the desired size, please ask your designer to draw one. "Responsive" checkmark should be unchecked when exporting icon.'`
);

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
    loading: PropTypes.bool,
    suppressSizeWarning: PropTypes.bool
  };

  static defaultProps = ({
    className: '',
    color: Color.DEFAULT,
    glyph: ''
  });

  warnSize() {
    if (this.props.suppressSizeWarning) {
      return;
    }
    warnSize();
  }

  getStyle() {
    const {size, width, height} = this.props;
    if (width || height) {
      this.warnSize();
      return {width, height};
    }
    if (size) {
      this.warnSize();
      return {
        width: size,
        height: size
      };
    }
    return null;
  }

  isCompatibilityMode(iconSrc) {
    const hasWidth = /width="[\d\.]+"/ig.test(iconSrc);
    const hasHeight = /height="[\d\.]+"/ig.test(iconSrc);
    return !hasWidth || !hasHeight;
  }

  getIconSource() {
    const {glyph} = this.props;
    return glyph?.call ? String(glyph) : glyph;
  }

  setSvgDOMAttributes(svgNode) {
    svgNode.classList.add(styles.glyph);
    if (this.isCompatibilityMode(this.getIconSource())) {
      svgNode.classList.add(styles.compatibilityMode);
    }

    const style = this.getStyle();
    if (style) {
      svgNode.style.width = `${style.width}px`;
      svgNode.style.height = `${style.height}px`;
    }
  }

  svgNodeRef = node => {
    if (!node || !node.firstChild) {
      return;
    }
    this.setSvgDOMAttributes(node.firstChild);
  };

  render() {
    const {
      // eslint-disable-next-line no-unused-vars
      className, size, color, loading, glyph, width, height, suppressSizeWarning,
      ...restProps
    } = this.props;

    const iconSrc = this.getIconSource();
    if (!iconSrc) {
      // eslint-disable-next-line no-console
      console.warn('No icon source passed to Icon component', this.props);
      return null;
    }

    const classes = classNames(styles.icon,
      {
        [styles[color]]: !!color,
        [styles.loading]: loading
      },
      className
    );

    return (
      <span
        {...restProps}
        className={classes}
        dangerouslySetInnerHTML={{
          __html: iconSrc
        }}
        ref={this.svgNodeRef}
      />
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
