import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import createResizeDetector from 'element-resize-detector';

import scheduleRAF from '../global/schedule-raf';

import styles from './island.css';

const scheduleScrollAction = scheduleRAF();
const noop = () => {};
const resizeDetector = createResizeDetector();

export default class Content extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    scrollableWrapperClassName: PropTypes.string,
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
  };

  componentWillUnmount() {
    this.scrollableNode = null;
    if (!this.wrapperNode) {
      return;
    }
    resizeDetector.removeAllListeners(this.wrapperNode);
  }

  setWrapper = node => {
    if (!node) {
      return;
    }
    this.wrapperNode = node;
    resizeDetector.listenTo(node, this.calculateScrollPosition);
  };

  calculateScrollPosition = () => scheduleScrollAction(() => {
    const {scrollableNode} = this;
    if (!scrollableNode) {
      return;
    }
    const {scrollTop, scrollHeight, offsetHeight} = scrollableNode;
    const scrolledToTop = scrollTop === 0;
    const scrolledToBottom = offsetHeight + scrollTop >= scrollHeight;
    this.setState({scrolledToTop, scrolledToBottom});
  });

  onScroll = () => {
    const {scrollTop, scrollHeight} = this.scrollableNode;
    this.props.onScroll({scrollTop, scrollHeight});
    this.calculateScrollPosition();
  };

  setScrollableNodeAndCalculatePosition = node => {
    if (!node) {
      return;
    }
    this.scrollableNode = node;
    this.calculateScrollPosition();
  };

  render() {
    const {children, className, bottomBorder, scrollableWrapperClassName, onScroll, fade, ...restProps} = this.props; // eslint-disable-line no-unused-vars, max-len
    const {scrolledToTop, scrolledToBottom} = this.state;

    const classes = classNames(styles.content, className, {
      [styles.contentWithTopFade]: fade && !scrolledToTop,
      [styles.contentWithBottomFade]: fade && !scrolledToBottom,
      [styles.withTransparentBottomBorder]: bottomBorder,
      [styles.withBottomBorder]: bottomBorder && !scrolledToBottom
    });

    const scrollableWrapperClasses = classNames(
      styles.scrollableWrapper,
      scrollableWrapperClassName
    );

    return (
      <div
        {...restProps}
        data-test="ring-island-content"
        className={classes}
      >
        <div
          className={scrollableWrapperClasses}
          ref={this.setScrollableNodeAndCalculatePosition}
          onScroll={fade ? this.onScroll : noop}
        >
          {fade && <div ref={this.setWrapper}>
            {children}
          </div>}

          {!fade && children}
        </div>
      </div>
    );
  }
}
