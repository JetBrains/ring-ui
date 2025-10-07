import * as React from 'react';
import {type AllHTMLAttributes, Component, createContext, type ReactNode} from 'react';
import classNames from 'classnames';

import Popup, {type PopupAttrs} from '../popup/popup';
import {Listeners} from '../global/dom';
import dataTests from '../global/data-tests';
import scheduleRAF from '../global/schedule-raf';
import Theme, {ThemeProvider} from '../global/theme';

import styles from './tooltip.css';

const scheduleScroll = scheduleRAF();

interface Context {
  onNestedTooltipShow: () => void;
  onNestedTooltipHide: () => void;
}

const TooltipContext = createContext<Context | undefined>(undefined);

export interface TooltipProps extends Omit<AllHTMLAttributes<HTMLSpanElement>, 'title'> {
  delay?: number | null | undefined;
  selfOverflowOnly?: boolean | null | undefined;
  popupProps?: Partial<PopupAttrs> | null | undefined;
  title?: ReactNode | null | undefined;
  theme?: Theme | 'inherit';
  'data-test'?: string | null | undefined;
  long?: boolean | null | undefined;
}
/**
 * @name Tooltip
 */
export default class Tooltip extends Component<TooltipProps> {
  static defaultProps = {
    title: '',
    selfOverflowOnly: false,
    theme: Theme.DARK,
    popupProps: {},
  };

  state = {
    showPopup: false,
    showNestedPopup: false,
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
      this.hidePopup();
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
    if (this.containerNode) {
      this.listeners.add(this.containerNode, 'mouseenter', this.tryToShowPopup);
      this.listeners.add(this.containerNode, 'mouseleave', ev => {
        if (ev.relatedTarget && this.popup?.container?.contains(ev.relatedTarget as Node)) {
          return;
        }

        this.hidePopup();
      });

      this.listeners.add(this.containerNode, 'focusin', this.tryToShowPopup);
      this.listeners.add(this.containerNode, 'focusout', ev => {
        if (ev.relatedTarget && this.popup?.container?.contains(ev.relatedTarget as Node)) {
          return;
        }

        this.hidePopup();
      });
    }
    this.listeners.add(document, 'scroll', () => scheduleScroll(this.hidePopup), {passive: true});
  }

  hideIfMovedOutsidePopup = (ev: React.SyntheticEvent<HTMLElement>) => {
    if (!('relatedTarget' in ev) || this.popup?.container?.contains(ev.relatedTarget as Node | null)) {
      return;
    }
    this.hidePopup();
  };

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
    const {
      children,
      'data-test': dataTest,
      title,
      delay,
      theme,
      selfOverflowOnly,
      popupProps,
      long,
      ...restProps
    } = this.props;

    const ariaProps = typeof title === 'string' && !!title ? {'aria-label': title, role: 'tooltip'} : {};

    const {onNestedTooltipShow, onNestedTooltipHide} = this;

    const popup = (
      <Popup
        trapFocus={false}
        anchorElement={this.containerNode}
        hidden={!this.state.showPopup || this.state.showNestedPopup}
        onCloseAttempt={this.hidePopup}
        maxHeight={400}
        attached={false}
        onMouseOut={this.hideIfMovedOutsidePopup}
        top={4}
        dontCloseOnAnchorClick
        ref={this.popupRef}
        {...popupProps}
        className={classNames(
          styles.tooltip,
          {[styles.long]: long, [styles.inheritedTheme]: theme === 'inherit'},
          popupProps?.className,
        )}
      >
        {title}
      </Popup>
    );

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
          {theme === 'inherit' ? (
            popup
          ) : (
            <ThemeProvider theme={theme} passToPopups WrapperComponent={props => <span {...props} />}>
              {popup}
            </ThemeProvider>
          )}
        </span>
      </TooltipContext.Provider>
    );
  }
}
export type TooltipAttrs = React.JSX.LibraryManagedAttributes<typeof Tooltip, TooltipProps>;
