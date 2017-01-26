import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './island.css';

const SIZE_FONT_DIFF = 16;
const ADDITIONAL_PADDING_DIFF = 32;

export default class Header extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    border: PropTypes.bool,
    size: PropTypes.number
  };

  render() {
    const {children, className, border, size, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
      [styles.withBottomBorder]: border
    });

    const headerStyle = size ? {
      lineHeight: `${size}px`,
      paddingTop: `${size - ADDITIONAL_PADDING_DIFF}px`
    } : null;

    const fontSize = size ? (size - SIZE_FONT_DIFF) : null;

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
