/**
 * @fileoverview Popup Menu.
 */

import React from 'react';
import mixin from 'react-mixin';
import RingComponent from 'ring-component/ring-component';
import Popup from 'popup/popup';
import List from 'list/list';

/**
 * @name Popup Menu
 * @constructor
 * @mixes {Popup.Mixin}
 * @extends {ReactComponent}
 * @example

   <example name="Popup Menu">
     <file name="index.html">
       <div>
         <div id="popup"></div>
       </div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var PopupMenu = require('popup-menu/popup-menu');

       var data = [
         {'label': 'One'},
         {'label': 'Two', 'href': 'http://www.jetbrains.com'},
         {'label': 'Three', 'type': PopupMenu.ListProps.Type.ITEM, 'href': 'http://www.jetbrains.com'},
         {'type': PopupMenu.ListProps.Type.SEPARATOR},
         {'label': 'Four', 'type': PopupMenu.ListProps.Type.LINK},
         {'label': 'Five', 'type': PopupMenu.ListProps.Type.LINK, 'href': 'http://www.jetbrains.com', 'className': 'test'},
         {'type': PopupMenu.ListProps.Type.SEPARATOR, 'description': 'Test group'},
         {'label': '1 Element in group', 'type': PopupMenu.ListProps.Type.ITEM},
         {'label': '2 Element in group', 'type': PopupMenu.ListProps.Type.ITEM}
       ];

       var popupMenu = PopupMenu.renderPopup(PopupMenu.factory({
         anchorElement: document.getElementById('popup'),
         corner: PopupMenu.PopupProps.Corner.TOP_LEFT,
         classNames: ['additional', 'class', 'names'],
         data: data
       }, null));
     </file>
   </example>
 */
@mixin.decorate(Popup.Mixin)
@mixin.decorate(List.Mixin)
export default class PopupMenu extends RingComponent {
  static defaultProps = {
    data: []
  };

  /** @override */
  getInternalContent() {
    return (
      <div>
        <List
          ref="List"
          {...this.props}
          maxHeight={this._getStyles().maxHeight}
          onSelect={this.props.onSelect}
          shortcuts={this.shortcutsEnabled()}
        />
      </div>
    );
  }
}
