import React, {createElement} from 'react';

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

       var Tooltip = require('ring-ui/components/tooltip/tooltip');

       render(
         <Tooltip title="explanation for text that reqires explanation">text that reqires explanation</Tooltip>,
         document.getElementById('tooltip')
       );
     </file>
   </example>
 */
export default class Tooltip extends RingComponent {
  didMount() {
    this.node.addEventListener('mouseover', () => {
      this.popup = Popup.renderPopup(createElement(Popup, {
        anchorElement: this.node,
        maxHeight: 400,
        className: 'ring-tooltip',
        cutEdge: false,
        onClose: evt => {
          //RG-643 Don't close tooltip when clicking by element with opened tooltip
          if (evt && this.node.contains(evt.target)) {
            return false;
          }
        }
      }, this.props.title));
    });

    this.node.addEventListener('mouseout', () => {
      this.closePopup();
    });
  }

  willUnmount() {
    this.closePopup();
  }

  closePopup() {
    if (this.popup) {
      this.popup.close();
      this.popup = null;
    }
  }

  render() {
    const {children, title, ...props} = this.props;

    return <span {...props}>{children}</span>;
  }
}
