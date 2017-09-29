import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Popup from '../popup/popup';
import {Listeners} from '../global/dom';

import './tooltip.scss';

/**
 * @name Tooltip
 * @category Components
 * @constructor
 * @description Displays a tooltip.
 * @extends {ReactComponent}
 * @example
   <example name="Tooltip">
     <file name="index.html">
       <div id="tooltip"></div>
     </file>

     <file name="index.js" webpack="true">
       import React from 'react';
       import {render} from 'react-dom';

       import Tooltip from '@jetbrains/ring-ui/components/tooltip/tooltip';
       import Button from '@jetbrains/ring-ui/components/button/button';

       const buttonWithTooltip = (
         <Tooltip title="Explanation">
           <Button>Button that requires an explanation</Button>
         </Tooltip>
       );

       render(buttonWithTooltip, document.getElementById('tooltip'));
     </file>
   </example>
 */
export default class Tooltip extends Component {
  static propTypes = {
    delay: PropTypes.number,
    popupProps: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.node
  };

  static PopupProps = Popup.PopupProps;

  static defaultProps = {
    title: '',
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
    this.listeners.removeAll();
  }

  listeners = new Listeners();
  containerRef = el => {
    this.containerNode = el;
  };

  showPopup = () => {
    const {delay, title} = this.props;

    if (!title) {
      return;
    }

    const showPopup = () => {
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
    const {children, title, delay, popupProps, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    return (
      <span {...restProps} ref={this.containerRef}>
        {children}
        <Popup
          hidden={!this.state.showPopup}
          onCloseAttempt={this.hidePopup}
          maxHeight={400}
          className="ring-tooltip"
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
