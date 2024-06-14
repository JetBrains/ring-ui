/**
 * @name Icon
 */

import {PureComponent, ComponentType, SVGAttributes, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import {Color, Size} from './icon__constants';
import styles from './icon.css';
import IconSVG from './icon__svg';

const warnSize = deprecate(
  () => {},
  `\`size\`, \`width\` and \`height\` props are not recommended to use in Ring UI \`Icon\` component. The intrinsic sizes of SVG icon (\`width\` and \`height\` SVG attributes) are used instead.

We strongly recommend to use icons handcrafted for particular sizes. If your icon doesn't exist in the desired size, please ask your designer to draw one. "Responsive" checkmark should be unchecked when exporting icon.'`
);

export type IconType = ComponentType<SVGAttributes<SVGSVGElement>>

export interface IconProps extends HTMLAttributes<HTMLElement> {
  color: Color
  glyph: string | IconType | null
  height?: number | undefined
  size?: Size | number | null | undefined
  width?: number | undefined
  loading?: boolean | null | undefined
  suppressSizeWarning?: boolean | null | undefined
}

export default class Icon extends PureComponent<IconProps> {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
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

  static Color = Color;
  static Size = Size;

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
    return undefined;
  }

  render() {
    const {
      className, size, color, loading, glyph: Glyph, width, height, suppressSizeWarning,
      ...restProps
    } = this.props;

    if (!Glyph) {
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
      >
        {typeof Glyph === 'string'
          ? <IconSVG src={Glyph} style={this.getStyle()}/>
          : <Glyph className={styles.glyph} style={this.getStyle()}/>
        }
      </span>
    );
  }
}

export type IconAttrs = JSX.LibraryManagedAttributes<typeof Icon, IconProps>

export {Color, Size};
