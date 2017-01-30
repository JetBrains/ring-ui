import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './island.css';

const SIZE_FONT_DIFF = 16;
const ADDITIONAL_PADDING_DIFF = 35;
export const MAX_SIZE = 40;
export const MIN_SIZE = 30;

export default class Header extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    border: PropTypes.bool,
    size: PropTypes.number
  };

  getFontSize(size) {
    const fontDiff = SIZE_FONT_DIFF + (1 - (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE));
    return size - fontDiff;
  }

  getTopPadding(size) {
    const padding = size - ADDITIONAL_PADDING_DIFF;
    return padding <= 0 ? 0 : padding;
  }

  render() {
    const {children, className, border, size, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
      [styles.withBottomBorder]: border
    });

    const headerStyle = size ? {
      lineHeight: `${size}px`,
      paddingTop: this.getTopPadding(size)
    } : null;

    const fontSize = size ? this.getFontSize(size) : null;

    return (
      <div
        {...restProps}
        data-test="ring-island-header"
        className={classes}
        style={headerStyle}
      >
        <div
          className={styles.title}
          style={{fontSize}}
        >
          {children}
        </div>
      </div>
    );
  }
}
