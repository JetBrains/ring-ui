import React, {PropTypes, Component, cloneElement} from 'react';

import Anchor from './anchor';

/**
 * @name Dropdown
 * @category Components
 * @framework React
 * @constructor
 * @description A stateful popup with clickable anchor
 * @example
   <example name="Dropdown">
     <file name="index.html">
       <div id="dropdown"></div>
     </file>

     <file name="index.js">
       import {render} from 'react-dom';
       import React from 'react';

       import Dropdown from 'ring-ui/components/dropdown/dropdown';
       import Popup from 'ring-ui/components/popup/popup';

       const container = document.getElementById('dropdown');
       const dropdown = (
         <Dropdown
           anchor="Click me"
         >
           <Popup>Popup content</Popup>
         </Dropdown>
       );

       render(dropdown, container);
     </file>
   </example>

   <example name="Dropdown with custom anchor and popup">
     <file name="index.html">
       <div id="dropdown"></div>
     </file>

     <file name="index.js">
       import {render} from 'react-dom';
       import React from 'react';

       import Dropdown from 'ring-ui/components/dropdown/dropdown';
       import Button from 'ring-ui/components/button/button';
       import PopupMenu from 'ring-ui/components/popup-menu/popup-menu';

       const container = document.getElementById('dropdown');
       const actions = ['Cut', 'Copy', 'Paste'];
       const dropdown = (
         <Dropdown
           anchor={<Button delayed={true}>Edit</Button>}
         >
           <PopupMenu
             closeOnSelect={true}
             data={actions.map(label => ({label}))}
           />
         </Dropdown>
       );

       render(dropdown, container);
     </file>
   </example>
 */

export default class Dropdown extends Component {
  static propTypes = {
    anchor: PropTypes.node.isRequired,
    children: PropTypes.element.isRequired,
    initShown: PropTypes.bool
  };

  static defaultProps = {
    initShown: false
  }

  state = {show: this.props.initShown};

  toggle = flag => {
    const show = typeof flag === 'boolean' ? flag : !this.state.show;
    this.setState({show});
  };

  hide = () => this.toggle(false);

  render() {
    const {children, anchor, initShown, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    const anchorElement = typeof anchor === 'string'
      ? <Anchor>{anchor}</Anchor>
      : anchor;

    return (
      <div
        {...restProps}
        data-test="ring-dropdown"
        onClick={this.toggle}
      >
        {anchorElement}
        {cloneElement(children, {
          hidden: !this.state.show,
          onCloseAttempt: this.hide,
          dontCloseOnAnchorClick: true
        })}
      </div>
    );
  }
}

