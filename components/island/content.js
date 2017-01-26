import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import throttle from 'mout/function/throttle';
import styles from './island.css';

const noop = () => {};
const FADE_SHOW_TROTTLING = 50;

export default class Content extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fade: PropTypes.bool,
    onScroll: PropTypes.func
  };

  static defaultProps = {
    fade: true,
    onScroll: noop
  };

  state = {
    scrolledToTop: true,
    scrolledToBottom: false
  }

  calculateScrollPosition = throttle(scrollableNode => {
    const {scrollTop, scrollHeight, offsetHeight} = scrollableNode;
    const scrolledToTop = scrollTop === 0;
    const scrolledToBottom = offsetHeight + scrollTop >= scrollHeight;
    this.setState({scrolledToTop, scrolledToBottom});
  }, FADE_SHOW_TROTTLING)

  onScroll = event => {
    const {scrollTop, scrollHeight} = event.nativeEvent.target;
    this.props.onScroll({scrollTop, scrollHeight});
    this.calculateScrollPosition(event.nativeEvent.target);
  }

  render() {
    const {children, className, onScroll, fade, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const {scrolledToTop, scrolledToBottom} = this.state;

    const classes = classNames(styles.content, className, {
      [styles.contentWithTopFade]: fade && !scrolledToTop,
      [styles.contentWithBottomFade]: fade && !scrolledToBottom
    });

    return (
      <div
        {...restProps}
        data-test="ring-island-content"
        className={classes}
      >
        <div
          className={styles.scrollableWrapper}
          ref={this.calculateScrollPosition}
          onScroll={fade ? this.onScroll : noop}
        >
          {children}
        </div>
      </div>
    );
  }
}
