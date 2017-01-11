import React from 'react';
import Popup from '../popup/popup';
import List from '../list/list';

/**
 * @name Popup Menu
 * @category Components
 * @constructor
 * @description Displays a popup menu.
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
       var PopupMenu = require('ring-ui/components/popup-menu/popup-menu');
       var Button = require('ring-ui/components/button/button');

       var data = [
          {'label': 'Item'},
          {'label': 'Link to jetbrains.com', 'href': 'http://www.jetbrains.com'},
          {'rgItemType': PopupMenu.ListProps.Type.SEPARATOR},
          {'rgItemType': PopupMenu.ListProps.Type.LINK, 'label': 'Link Item'},
          {'rgItemType': PopupMenu.ListProps.Type.LINK, 'label': 'Link Item With Additional Class', 'className': 'test'},
          {'rgItemType': PopupMenu.ListProps.Type.SEPARATOR, 'description': 'Separator With Description'},
          {'rgItemType': PopupMenu.ListProps.Type.TITLE, 'label': 'Title'},
          {'rgItemType': PopupMenu.ListProps.Type.ITEM, 'label': '1 Element in group'},
          {'rgItemType': PopupMenu.ListProps.Type.ITEM, 'label': '2 Element in group'}
       ];

       var popupMenu = PopupMenu.renderPopup(PopupMenu.factory({
         anchorElement: document.getElementById('popup'),
         classNames: ['additional', 'class', 'names'],
         shortcuts: true,
         data: data
       }, null));
     </file>
   </example>
 */
export default class PopupMenu extends Popup {
  static isItemType = List.isItemType;
  static ListProps = List.ListProps;

  /** @override */
  getInternalContent() {
    return (
      <div>
        <List
          ref="List"
          {...this.getRestProps()}
          maxHeight={this.position().maxHeight}
          shortcuts={this.shortcutsEnabled()}
        />
      </div>
    );
  }
}
