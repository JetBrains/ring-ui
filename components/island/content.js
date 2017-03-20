import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import throttle from 'mout/function/throttle';
import styles from './island.css';
import createResizeDetector from 'element-resize-detector';

const noop = () => {};
const FADE_SHOW_TROTTLING = 50;
const resizeDetector = createResizeDetector();

export default class Content extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    fade: PropTypes.bool,
    bottomBorder: PropTypes.bool,
    onScroll: PropTypes.func
  };

  static defaultProps = {
    fade: true,
    bottomBorder: false,
    onScroll: noop
  };

  state = {
    scrolledToTop: true,
    scrolledToBottom: false
  }

  componentWillUnmount() {
    resizeDetector.removeAllListeners(this.wrapperNode);
  }

  setWrapper = node => {
    this.wrapperNode = node;
    resizeDetector.listenTo(node, this.calculateScrollPosition);
  }

  calculateScrollPosition = throttle(() => {
    const {scrollableNode} = this;
    if (!scrollableNode) {
      return;
    }
    const {scrollTop, scrollHeight, offsetHeight} = scrollableNode;
    const scrolledToTop = scrollTop === 0;
    const scrolledToBottom = offsetHeight + scrollTop >= scrollHeight;
    this.setState({scrolledToTop, scrolledToBottom});
  }, FADE_SHOW_TROTTLING)

  onScroll = () => {
    const {scrollTop, scrollHeight} = this.scrollableNode;
    this.props.onScroll({scrollTop, scrollHeight});
    this.calculateScrollPosition();
  }

  setScrollableNodeAndCalculatePosition = node => {
    this.scrollableNode = node;
    this.calculateScrollPosition();
  }

  render() {
    const {children, className, bottomBorder, onScroll, fade, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const {scrolledToTop, scrolledToBottom} = this.state;

    const classes = classNames(styles.content, className, {
      [styles.contentWithTopFade]: fade && !scrolledToTop,
      [styles.contentWithBottomFade]: fade && !scrolledToBottom,
      [styles.withTransparentBottomBorder]: bottomBorder,
      [styles.withBottomBorder]: bottomBorder && !scrolledToBottom
    });

    return (
      <div
        {...restProps}
        data-test="ring-island-content"
        className={classes}
      >
        <div
          className={styles.scrollableWrapper}
          ref={this.setScrollableNodeAndCalculatePosition}
          onScroll={fade ? this.onScroll : noop}
        >
          <div ref={this.setWrapper}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
