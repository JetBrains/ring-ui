import {forwardRef, Component, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import createResizeDetector from 'element-resize-detector';

import scheduleRAF from '../global/schedule-raf';

import styles from './island.css';
import {ScrollHandlerContext} from './adaptive-island-hoc';

const scheduleScrollAction = scheduleRAF();
const noop = () => {};
const END_DISTANCE = 16;

export interface IslandContentProps extends Omit<HTMLAttributes<HTMLElement>, 'onScroll'> {
  fade?: boolean | null | undefined
  onScrollToBottom?: (() => void) | null | undefined
  scrollableWrapperClassName?: string | null | undefined
}

export interface IslandContentInnerProps extends IslandContentProps {
  onScroll: (node: HTMLElement) => void
  bottomBorder: boolean
}

class Content extends Component<IslandContentInnerProps> {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    scrollableWrapperClassName: PropTypes.string,
    fade: PropTypes.bool,
    bottomBorder: PropTypes.bool,
    onScroll: PropTypes.func,
    onScrollToBottom: PropTypes.func
  };

  static defaultProps = {
    fade: true,
    bottomBorder: false,
    onScroll: noop,
    onScrollToBottom: noop
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
    this.resizeDetector.removeAllListeners(this.wrapperNode);
  }

  resizeDetector = createResizeDetector({strategy: 'scroll'});

  wrapperNode?: HTMLElement | null;
  setWrapper = (node: HTMLElement | null) => {
    if (!node) {
      return;
    }
    this.wrapperNode = node;
    this.resizeDetector.listenTo(node, this.calculateScrollPosition);
  };

  calculateScrollPosition = () => scheduleScrollAction(() => {
    const {scrollableNode} = this;
    if (!scrollableNode) {
      return;
    }
    this.props.onScroll(scrollableNode);
    const {scrollTop, scrollHeight, offsetHeight} = scrollableNode;
    const scrolledToTop = scrollTop === 0;
    const scrolledToBottom = offsetHeight + scrollTop >= scrollHeight - END_DISTANCE;

    if (scrolledToBottom) {
      this.props.onScrollToBottom?.();
    }

    this.setState({scrolledToTop, scrolledToBottom});
  });

  scrollableNode?: HTMLElement | null;
  setScrollableNodeAndCalculatePosition = (node: HTMLElement | null) => {
    if (!node) {
      return;
    }
    this.scrollableNode = node;
    this.calculateScrollPosition();
  };

  render() {
    const {
      children, className, bottomBorder, scrollableWrapperClassName,
      onScroll, onScrollToBottom, fade, tabIndex, ...restProps
    } = this.props;
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
          tabIndex={tabIndex}
          className={scrollableWrapperClasses}
          ref={this.setScrollableNodeAndCalculatePosition}
          onScroll={fade ? this.calculateScrollPosition : noop}
        >
          {fade && (
            <div ref={this.setWrapper}>
              {children}
            </div>
          )}

          {!fade && children}
        </div>
      </div>
    );
  }
}

const ContentWrapper = forwardRef<Content, IslandContentProps>((props, ref) => (
  <ScrollHandlerContext.Consumer>
    {onScroll => {
      const addProps = onScroll != null ? {onScroll, bottomBorder: true} : {};
      return <Content {...props} {...addProps} ref={ref}/>;
    }}
  </ScrollHandlerContext.Consumer>
));

ContentWrapper.displayName = 'ContentWrapper';

export default ContentWrapper;
