import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Popup from '../popup/popup';
import {Listeners} from '../global/dom';
import dataTests from '../global/data-tests';

import styles from './tooltip.css';

/**
 * @name Tooltip
 */
export default class Tooltip extends Component {
  static PopupProps = Popup.PopupProps;

  static propTypes = {
    delay: PropTypes.number,
    selfOverflowOnly: PropTypes.bool,
    popupProps: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.node,
    'data-test': PropTypes.string
  };

  static defaultProps = {
    title: '',
    selfOverflowOnly: false,
    popupProps: {}
  };

  state = {showPopup: false};

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

  listeners = new Listeners();
  containerRef = el => {
    this.containerNode = el;
  };

  showPopup = () => {
    const {delay, title, selfOverflowOnly} = this.props;

    if (!title) {
      return;
    }

    const showPopup = () => {
      if (selfOverflowOnly) {
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
      this.setState({showPopup: true});
    };

    if (delay) {
      this.timeout = setTimeout(showPopup, delay);
    } else {
      showPopup();
    }
  };

  hidePopup = () => {
    clearTimeout(this.timeout);
    this.setState({showPopup: false});
  };

  addListeners() {
    this.listeners.add(this.containerNode, 'mouseover', this.showPopup);
    this.listeners.add(this.containerNode, 'mouseout', this.hidePopup);
    this.listeners.add(document, 'scroll', this.hidePopup);
  }

  popupRef = el => {
    this.popup = el;
  };

  render() {
    const {children, 'data-test': dataTest,
      title, delay, selfOverflowOnly, popupProps, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    return (
      <span
        {...restProps}
        ref={this.containerRef}
        data-test={dataTests('ring-tooltip', dataTest)}
      >
        {children}
        <Popup
          hidden={!this.state.showPopup}
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
    );
  }
}
