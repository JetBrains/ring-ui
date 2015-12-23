import React, {createElement, Children, PropTypes} from 'react';

import Popup from '../popup/popup';
import RingComponent from '../ring-component/ring-component';

import './tooltip.scss';

/**
 * @name Tooltip
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="React Tooltip">
     <file name="index.html">
       <div id="tooltip"></div>
     </file>

     <file name="index.js" webpack="true">
       import React from 'react';
       import {render} from 'react-dom';

       import Tooltip from 'ring-ui/components/tooltip/tooltip';
       import Button from 'ring-ui/components/button/button';

       const buttonWithTooltip = (
         <Tooltip title="explanation for button that reqires explanation">
           <Button>explanation for button that reqires explanation</Button>
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

  static defaultProps = {
    title: '',
    popupProps: {}
  };

  didMount() {
    this.hidePopupHandler = this.hidePopup.bind(this);
    this.showPopupHandler = this.showPopup.bind(this);

    this.setHandlersEnabled(this.props.title);
  }

  willUnmount() {
    this.hidePopup();
    this.setHandlersEnabled(false);
  }

  didUpdate(nextProps) {
    const titleStateHasChanged = Boolean(nextProps.title) === Boolean(this.props.title);

    this.setHandlersEnabled(titleStateHasChanged);
  }

  setHandlersEnabled(condition) {
    if (condition) {
      this.node.addEventListener('mouseover', this.showPopupHandler);
      this.node.addEventListener('mouseout', this.hidePopupHandler);
      document.addEventListener('scroll', this.hidePopupHandler);
    } else {
      this.node.removeEventListener('mouseover', this.showPopupHandler);
      this.node.removeEventListener('mouseout', this.hidePopupHandler);
      document.removeEventListener('scroll', this.hidePopupHandler);
    }
  }

  showPopup() {
    const {delay, title, popupProps} = this.props;

    if (!title) {
      return;
    }

    const renderPopup = () => {
      const props = Object.assign({
        anchorElement: this.node,
        maxHeight: 400,
        className: 'ring-tooltip',
        cutEdge: false,
        top: 4,
        onClose: evt => {
          //RG-643 Don't close tooltip when clicking by element with opened tooltip
          if (evt && this.node.contains(evt.target)) {
            return false;
          }
        }
      }, popupProps);

      this.popup = Popup.renderPopup(createElement(Popup, props, title));
    };

    if (delay) {
      this.timeout = setTimeout(renderPopup, delay);
    } else {
      renderPopup();
    }
  }

  hidePopup() {
    clearTimeout(this.timeout);

    if (this.popup) {
      this.popup.close();
      this.popup = null;
    }
  }

  render() {
    const {children, title, ...props} = this.props;

    if (Children.count(children) === 1 && typeof children === 'object') {
      return children;
    // Autowrapping of text and array children
    } else {
      return <span {...props}>{children}</span>;
    }
  }
}
