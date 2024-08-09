import {AllHTMLAttributes, Component, createContext, ReactNode} from 'react';
import * as React from 'react';

import classNames from 'classnames';

import Popup, {PopupAttrs} from '../popup/popup';
import {Listeners} from '../global/dom';
import dataTests from '../global/data-tests';
import scheduleRAF from '../global/schedule-raf';

import styles from './tooltip.css';

const scheduleScroll = scheduleRAF();

interface Context {
  onNestedTooltipShow: () => void
  onNestedTooltipHide: () => void
}

const TooltipContext = createContext<Context | undefined>(undefined);

export interface TooltipProps extends Omit<AllHTMLAttributes<HTMLSpanElement>, 'title'> {
  delay?: number | null | undefined
  selfOverflowOnly?: boolean | null | undefined
  popupProps?: Partial<PopupAttrs> | null | undefined
  title?: ReactNode | null | undefined
  'data-test'?: string | null | undefined
  long?: boolean | null | undefined
}
/**
 * @name Tooltip
 */
export default class Tooltip extends Component<TooltipProps> {
  static defaultProps = {
    title: '',
    selfOverflowOnly: false,
    popupProps: {}
  };

  state = {
    showPopup: false,
    showNestedPopup: false
  };

  componentDidMount() {
    if (this.props.title) {
      this.addListeners();
    }
  }

  componentDidUpdate(prevProps: TooltipProps) {
    if (!prevProps.title && this.props.title) {
      this.addListeners();
    } else if (prevProps.title && !this.props.title) {
      this.listeners.removeAll();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.listeners.removeAll();
  }

  static PopupProps = Popup.PopupProps;
  static contextType = TooltipContext;

  declare context: React.ContextType<typeof TooltipContext>;
  timeout?: number;
  listeners = new Listeners();
  containerNode?: HTMLElement | null;
  containerRef = (el: HTMLElement | null) => {
    this.containerNode = el;
  };

  tryToShowPopup = () => {
    const {delay, title} = this.props;

    if (!title) {
      return;
    }

    if (delay) {
      this.timeout = window.setTimeout(this.showPopup, delay);
    } else {
      this.showPopup();
    }
  };

  showPopup = () => {
    if (this.props.selfOverflowOnly) {
      const {containerNode} = this;

      // rare cases when containerNode is null are possible;
      // probably the collision is due to the asynchronous nature of the code,
      // i.e. this code runs after the component is unmounted,
      // although at first glance it looks unlikely.
      if (!containerNode) {
        return;
      }

      // inline element?
      if (containerNode.clientWidth === 0 && containerNode.clientHeight === 0) {
        return;
      }
      if (
        containerNode.scrollWidth <= containerNode.clientWidth &&
        containerNode.scrollHeight <= containerNode.clientHeight
      ) {
        return;
      }
    }

    this.context?.onNestedTooltipShow();
    this.setState({showPopup: true});
  };

  hidePopup = () => {
    clearTimeout(this.timeout);
    this.context?.onNestedTooltipHide();
    this.setState({showPopup: false});
  };

  addListeners() {
    if (this.containerNode != null) {
      this.listeners.add(this.containerNode, 'mouseover', this.tryToShowPopup);
      this.listeners.add(this.containerNode, 'mouseout', this.hidePopup);
    }
    this.listeners.add(document, 'scroll', () => scheduleScroll(this.hidePopup), {passive: true});
  }

  popup?: Popup | null;
  popupRef = (el: Popup | null) => {
    this.popup = el;
  };

  onNestedTooltipShow = () => {
    this.setState({showNestedPopup: true});
  };

  onNestedTooltipHide = () => {
    this.setState({showNestedPopup: false});
  };

  render() {
    const {children, 'data-test': dataTest,
      title, delay, selfOverflowOnly, popupProps, long, ...restProps} = this.props;

    const ariaProps = typeof title === 'string' && !!title
      ? {'aria-label': title, role: 'tooltip'}
      : {};

    const {onNestedTooltipShow, onNestedTooltipHide} = this;

    return (
      <TooltipContext.Provider value={{onNestedTooltipShow, onNestedTooltipHide}}>
        <span
          {...ariaProps}
          {...restProps}
          ref={this.containerRef}
          data-test={dataTests('ring-tooltip', dataTest)}
          data-test-title={typeof title === 'string' ? title : undefined}
        >
          {children}
          <Popup
            trapFocus={false}
            hidden={!this.state.showPopup || this.state.showNestedPopup}
            onCloseAttempt={this.hidePopup}
            maxHeight={400}
            className={classNames(styles.tooltip, {[styles.long]: long})}
            attached={false}
            top={4}
            dontCloseOnAnchorClick
            ref={this.popupRef}
            {...popupProps}
          >{title}</Popup>
        </span>
      </TooltipContext.Provider>
    );
  }
}
export type TooltipAttrs = JSX.LibraryManagedAttributes<typeof Tooltip, TooltipProps>
