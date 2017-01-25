import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './island.css';

const SIZE_FONT_DIFF = 8;

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
      minHeight: `${size}px`,
      lineHeight: `${size}px`
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
