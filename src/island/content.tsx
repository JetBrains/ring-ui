import {Component, type Ref, type HTMLAttributes} from 'react';
import classNames from 'classnames';

import scheduleRAF from '../global/schedule-raf';
import {ScrollHandlerContext} from './adaptive-island-hoc';

import styles from './island.css';

const scheduleScrollAction = scheduleRAF();
const noop = () => {};
// `onScrollToBottom` keeps the legacy 16px allowance so callbacks still fire when subpixel rounding or
// zoom leaves a small gap, while the visual fade hides only at the exact bottom edge.
const CALLBACK_END_DISTANCE = 16;
const FADE_END_DISTANCE = 1;

export interface IslandContentProps extends Omit<HTMLAttributes<HTMLElement>, 'onScroll'> {
  ref?: Ref<Content>;
  fade?: boolean | null | undefined;
  onScrollToBottom?: (() => void) | null | undefined;
  scrollableWrapperClassName?: string | null | undefined;
}

export interface IslandContentInnerProps extends IslandContentProps {
  ref?: Ref<Content>;
  onScroll: (node: HTMLElement) => void;
  bottomBorder: boolean;
}

class Content extends Component<IslandContentInnerProps> {
  static defaultProps = {
    fade: true,
    bottomBorder: false,
    onScroll: noop,
    onScrollToBottom: noop,
  };

  state = {
    scrolledToTop: true,
    showBottomFade: false,
  };

  componentWillUnmount() {
    this.scrollableNode = null;
    this.wrapperResizeObserver?.disconnect();
  }

  wrapperResizeObserver?: ResizeObserver;
  setWrapper = (node: HTMLElement | null) => {
    if (!node) {
      return;
    }
    this.wrapperResizeObserver?.disconnect();
    this.wrapperResizeObserver = new ResizeObserver(() => {
      this.calculateScrollPosition();
    });
    this.wrapperResizeObserver.observe(node);
  };

  calculateScrollPosition = () =>
    scheduleScrollAction(() => {
      const {scrollableNode} = this;
      if (!scrollableNode) {
        return;
      }
      this.props.onScroll(scrollableNode);
      const {scrollTop, scrollHeight, offsetHeight} = scrollableNode;
      const scrolledToTop = scrollTop === 0;
      const showBottomFade = offsetHeight + scrollTop >= scrollHeight - FADE_END_DISTANCE;
      const isNearBottom = offsetHeight > 0 && offsetHeight + scrollTop >= scrollHeight - CALLBACK_END_DISTANCE;

      if (isNearBottom) {
        this.props.onScrollToBottom?.();
      }

      this.setState({scrolledToTop, showBottomFade});
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
      ref,
      children,
      className,
      bottomBorder,
      scrollableWrapperClassName,
      onScroll,
      onScrollToBottom,
      fade,
      tabIndex,
      ...restProps
    } = this.props;
    const {scrolledToTop, showBottomFade} = this.state;

    const classes = classNames(styles.content, className, {
      [styles.contentWithTopFade]: fade && !scrolledToTop,
      [styles.contentWithBottomFade]: fade && !showBottomFade,
      [styles.withTransparentBottomBorder]: bottomBorder,
      [styles.withBottomBorder]: bottomBorder && !showBottomFade,
    });

    const scrollableWrapperClasses = classNames(styles.scrollableWrapper, scrollableWrapperClassName);

    return (
      <div {...restProps} data-test='ring-island-content' className={classes}>
        <div
          tabIndex={tabIndex}
          className={scrollableWrapperClasses}
          ref={this.setScrollableNodeAndCalculatePosition}
          onScroll={fade ? this.calculateScrollPosition : noop}
        >
          {fade && <div ref={this.setWrapper}>{children}</div>}

          {!fade && children}
        </div>
      </div>
    );
  }
}

const ContentWrapper = ({...props}: IslandContentProps) => (
  <ScrollHandlerContext.Consumer>
    {onScroll => {
      const addProps = onScroll ? {onScroll, bottomBorder: true} : {};
      return <Content {...props} {...addProps} />;
    }}
  </ScrollHandlerContext.Consumer>
);

ContentWrapper.displayName = 'ContentWrapper';

export default ContentWrapper;
