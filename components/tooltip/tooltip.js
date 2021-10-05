import React, {Component, createContext} from 'react';
import PropTypes from 'prop-types';

import Popup from '../popup/popup';
import {Listeners} from '../global/dom';
import dataTests from '../global/data-tests';
import scheduleRAF from '../global/schedule-raf';

import styles from './tooltip.css';

const scheduleScroll = scheduleRAF();

const TooltipContext = createContext();

/**
 * @name Tooltip
 */
export default class Tooltip extends Component {
  static propTypes = {
    delay: PropTypes.number,
    selfOverflowOnly: PropTypes.bool,
    popupProps: PropTypes.object,
    title: PropTypes.node,
    children: PropTypes.node,
    'data-test': PropTypes.string
  };

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

  componentDidUpdate(prevProps) {
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

  listeners = new Listeners();
  containerRef = el => {
    this.containerNode = el;
  };

  tryToShowPopup = () => {
    const {delay, title} = this.props;

    if (!title) {
      return;
    }

    if (delay) {
      this.timeout = setTimeout(this.showPopup, delay);
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
    this.listeners.add(this.containerNode, 'mouseover', this.tryToShowPopup);
    this.listeners.add(this.containerNode, 'mouseout', this.hidePopup);
    this.listeners.add(document, 'scroll', () => scheduleScroll(this.hidePopup), {passive: true});
  }

  popupRef = el => {
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
      title, delay, selfOverflowOnly, popupProps, ...restProps} = this.props;

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
            className={styles.tooltip}
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
