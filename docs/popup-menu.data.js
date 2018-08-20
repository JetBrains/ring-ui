window.source = {
  "title": "Popup Menu",
  "url": "popup-menu.html",
  "type": "js",
  "content": "import React from 'react';\nimport PropTypes from 'prop-types';\n\nimport Popup from '../popup/popup';\nimport List from '../list/list';\n\n/**\n * @name Popup Menu\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a popup menu.\n * @extends {ReactComponent}\n * @example\n   <example name=\"Popup Menu\">\n     <file name=\"index.html\" disable-auto-size>\n       <div>\n         <div id=\"popup\"></div>\n       </div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import PopupMenu, {ListProps} from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\n       const data = [\n          {'label': 'Item'},\n          {'label': 'Link to jetbrains.com', 'href': 'http://www.jetbrains.com'},\n          {'rgItemType': ListProps.Type.SEPARATOR},\n          {'rgItemType': ListProps.Type.LINK, 'label': 'Link Item'},\n          {'rgItemType': ListProps.Type.LINK, 'label': 'Link Item With Additional Class', 'className': 'test'},\n          {'rgItemType': ListProps.Type.SEPARATOR, 'description': 'Separator With Description'},\n          {'rgItemType': ListProps.Type.TITLE, 'label': 'Title'},\n          {'rgItemType': ListProps.Type.ITEM, 'label': '1 Element in group'},\n          {'rgItemType': ListProps.Type.ITEM, 'label': '2 Element in group'}\n       ];\n\n       render(<PopupMenu data={data}/>, document.getElementById('popup'));\n     </file>\n   </example>\n */\nexport default class PopupMenu extends Popup {\n  static isItemType = List.isItemType;\n  static ListProps = List.ListProps;\n\n  static propTypes = {\n    ...Popup.propTypes,\n    ...List.propTypes,\n    closeOnSelect: PropTypes.bool\n  };\n\n  static defaultProps = {\n    ...List.defaultProps,\n    ...Popup.defaultProps,\n    renderOptimization: false,\n    closeOnSelect: false\n  };\n\n  onSelect = (item, event) => {\n    if (this.props.closeOnSelect) {\n      this._onCloseAttempt(event);\n    }\n    this.props.onSelect(item, event);\n  };\n\n  listRef = el => {\n    this.list = el;\n  };\n\n  /** @override */\n  getInternalContent() {\n    // eslint-disable-next-line no-unused-vars\n    const {className, ...props} = this.props;\n\n    return (\n      <div>\n        <List\n          ref={this.listRef}\n          {...props}\n          maxHeight={this.popup && this.popup.style.maxHeight}\n          shortcuts={this.state.shortcuts}\n          onSelect={this.onSelect}\n        />\n      </div>\n    );\n  }\n}\n\nexport const {ListProps} = List;\n",
  "examples": [
    {
      "name": "Popup Menu",
      "url": "examples/popup-menu/popup-menu.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"popup\"></div>\n</div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport PopupMenu, {ListProps} from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\nconst data = [\n   {'label': 'Item'},\n   {'label': 'Link to jetbrains.com', 'href': 'http://www.jetbrains.com'},\n   {'rgItemType': ListProps.Type.SEPARATOR},\n   {'rgItemType': ListProps.Type.LINK, 'label': 'Link Item'},\n   {'rgItemType': ListProps.Type.LINK, 'label': 'Link Item With Additional Class', 'className': 'test'},\n   {'rgItemType': ListProps.Type.SEPARATOR, 'description': 'Separator With Description'},\n   {'rgItemType': ListProps.Type.TITLE, 'label': 'Title'},\n   {'rgItemType': ListProps.Type.ITEM, 'label': '1 Element in group'},\n   {'rgItemType': ListProps.Type.ITEM, 'label': '2 Element in group'}\n];\n\nrender(<PopupMenu data={data}/>, document.getElementById('popup'));\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a popup menu.",
  "attrs": {
    "name": "Popup Menu",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a popup menu.",
    "extends": "{ReactComponent}",
    "example": "   <example name=\"Popup Menu\">\n     <file name=\"index.html\" disable-auto-size>\n       <div>\n         <div id=\"popup\"></div>\n       </div>\n     </file>\n\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import PopupMenu, {ListProps} from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\n       const data = [\n          {'label': 'Item'},\n          {'label': 'Link to jetbrains.com', 'href': 'http://www.jetbrains.com'},\n          {'rgItemType': ListProps.Type.SEPARATOR},\n          {'rgItemType': ListProps.Type.LINK, 'label': 'Link Item'},\n          {'rgItemType': ListProps.Type.LINK, 'label': 'Link Item With Additional Class', 'className': 'test'},\n          {'rgItemType': ListProps.Type.SEPARATOR, 'description': 'Separator With Description'},\n          {'rgItemType': ListProps.Type.TITLE, 'label': 'Title'},\n          {'rgItemType': ListProps.Type.ITEM, 'label': '1 Element in group'},\n          {'rgItemType': ListProps.Type.ITEM, 'label': '2 Element in group'}\n       ];\n\n       render(<PopupMenu data={data}/>, document.getElementById('popup'));\n     </file>\n   </example>"
  }
};