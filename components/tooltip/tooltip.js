import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../popup/popup';
import RingComponent from '../ring-component/ring-component';
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

       import Tooltip from 'ring-ui/components/tooltip/tooltip';
       import Button from 'ring-ui/components/button/button';

       const buttonWithTooltip = (
         <Tooltip title="Explanation">
           <Button>Button that requires an explanation</Button>
         </Tooltip>
       );

       render(buttonWithTooltip, document.getElementById('tooltip'));
     </file>
   </example>
 */
export default class Tooltip extends RingComponent {
  static propTypes = {
    delay: PropTypes.number,
    popupProps: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  static PopupProps = Popup.PopupProps;

  static defaultProps = {
    title: '',
    popupProps: {}
  };

  state = {showPopup: false};

  listeners = new Listeners();

  didMount() {
    if (this.props.title) {
      this.addListeners();
    }
  }

  willUnmount() {
    this.listeners.removeAll();
  }

  didUpdate(prevProps) {
    if (!prevProps.title && this.props.title) {
      this.addListeners();
    } else if (prevProps.title && !this.props.title) {
      this.listeners.removeAll();
    }
  }

  addListeners() {
    this.listeners.add(this.node, 'mouseover', ::this.showPopup);
    this.listeners.add(this.node, 'mouseout', ::this.hidePopup);
    this.listeners.add(document, 'scroll', ::this.hidePopup);
  }

  showPopup() {
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
  }

  hidePopup() {
    clearTimeout(this.timeout);
    this.setState({showPopup: false});
  }

  render() {
    const {children, title, delay, popupProps, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    return (
      <span {...restProps}>
        {children}
        <Popup
          hidden={!this.state.showPopup}
          onCloseAttempt={::this.hidePopup}
          maxHeight={400}
          className="ring-tooltip"
          attached={false}
          top={4}
          dontCloseOnAnchorClick={true}
          ref={el => {
            this.popup = el;
          }}
          {...popupProps}
        >{title}</Popup>
      </span>
    );
  }
}
