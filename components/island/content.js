import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './island.css';

export default class Content extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fade: PropTypes.bool,
    onScroll: PropTypes.func
  };

  static defaultProps = {
    fade: true
  };

  onScroll = event => {
    const {scrollTop, scrollHeight} = event.nativeEvent.target;
    this.props.onScroll({scrollTop, scrollHeight});
  }

  render() {
    const {children, className, fade, ...restProps} = this.props;
    const classes = classNames(styles.content, className);

    return (
      <div
        {...restProps}
        data-test="ring-island-content"
        className={classes}
        onScroll={this.onScroll}
      >
        {fade && <div className={styles.fadeTop} />}
        {children}
        {fade && <div className={styles.fadeBottom} />}
      </div>
    );
  }
}
