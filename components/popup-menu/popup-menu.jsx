/**
 * @fileoverview Popup Menu.
 */

var React = require('react');
var Popup = require('popup/popup');
var List = require('list/list');

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
       var React = require('react');
       var PopupMenu = require('popup-menu/popup-menu');

       var popupMenu = PopupMenu.render(React.createElement(PopupMenu, {
         anchorElement: document.getElementById('popup'),
         corner: PopupMenu.PopupProps.Corner.TOP_LEFT,
         classNames: ['additional', 'class', 'names']
       }, null));

       popupMenu.setProps({data: [
         {'label': 'One'},
         {'label': 'Two', 'href': 'http://www.jetbrains.com'},
         {'label': 'Three', 'type': PopupMenu.ListProps.Type.ITEM, 'href': 'http://www.jetbrains.com'},
         {'type': PopupMenu.ListProps.Type.SEPARATOR},
         {'label': 'Four', 'type': PopupMenu.ListProps.Type.LINK},
         {'label': 'Five', 'type': PopupMenu.ListProps.Type.LINK, 'href': 'http://www.jetbrains.com', 'className': 'test'},
         {'type': PopupMenu.ListProps.Type.SEPARATOR, 'description': 'Test group'},
         {'label': '1 Element in group', 'type': PopupMenu.ListProps.Type.ITEM},
         {'label': '2 Element in group', 'type': PopupMenu.ListProps.Type.ITEM}
       ]});
     </file>
   </example>
 */
var PopupMenu = React.createClass({
  mixins: [Popup.Mixin, List.Mixin],

  getDefaultProps: function() {
    return {
      data: []
    };
  },

  /** @override */
  getInternalContent: function () {
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
});

module.exports = PopupMenu;
