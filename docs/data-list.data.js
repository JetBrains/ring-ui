window.source = {
  "title": "Data List",
  "url": "data-list.html",
  "type": "js",
  "content": "/**\n  * @name Data List\n  * @category Components\n  * @tags Ring UI Language\n  * @framework React\n  * @extends {PureComponent}\n  * @description A component for rendering interactive hierarchical tables.\n  * @example-file ./data-list.examples.html\n  */\n\nimport React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport focusSensorHOC from '../global/focus-sensor-hoc';\nimport selectionShortcutsHOC from '../table/selection-shortcuts-hoc';\nimport disableHoverHOC from '../table/disable-hover-hoc';\nimport getUID from '../global/get-uid';\nimport Shortcuts from '../shortcuts/shortcuts';\nimport Loader from '../loader/loader';\n\nimport Item, {moreLessButtonStates} from './item';\n\nimport styles from './data-list.css';\n\n\n// eslint-disable-next-line react/no-deprecated\nclass DataList extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    data: PropTypes.array.isRequired,\n    loading: PropTypes.bool,\n    focused: PropTypes.bool,\n    disabledHover: PropTypes.bool,\n    selection: PropTypes.object,\n    selectable: PropTypes.bool,\n    shortcutsMap: PropTypes.object,\n\n    itemFormatter: PropTypes.func.isRequired,\n\n    onItemMoreLess: PropTypes.func,\n    itemMoreLessState: PropTypes.func,\n    onSelect: PropTypes.func,\n\n    remoteSelection: PropTypes.bool\n  };\n\n  static defaultProps = {\n    loading: false,\n\n    onItemMoreLess: () => {},\n    itemMoreLessState: () => moreLessButtonStates.UNUSED,\n\n    remoteSelection: false\n  };\n\n  state = {\n    shortcutsEnabled: this.props.focused,\n    shortcutsScope: getUID('ring-data-list-')\n  };\n\n  componentWillReceiveProps(nextProps) {\n    const {data, selection, onSelect, selectable} = this.props;\n\n    if (data !== nextProps.data && !this.props.remoteSelection) {\n      onSelect(selection.cloneWith({data: nextProps.data}));\n    }\n\n    if (!nextProps.selectable && nextProps.selectable !== selectable) {\n      onSelect(selection.resetSelection());\n    }\n\n    const shortcutsEnabled = nextProps.focused;\n    if (shortcutsEnabled !== this.state.shortcutsEnabled) {\n      this.setState({shortcutsEnabled});\n    }\n  }\n\n\n  onItemFocus = item => {\n    const {selection, onSelect} = this.props;\n    onSelect(selection.focus(item));\n  };\n\n  onItemSelect = (item, selected) => {\n    const {selection, onSelect} = this.props;\n    if (selected) {\n      onSelect(selection.select(item));\n    } else {\n      onSelect(selection.deselect(item));\n    }\n  };\n\n  onEqualPress = () => {\n    const {\n      selection, itemFormatter\n    } = this.props;\n\n    const item = itemFormatter(selection.getFocused());\n\n    if (item.collapsed) {\n      item.onExpand();\n    } else {\n      item.onCollapse();\n    }\n  }\n\n  shortcutsMap = {\n    '=': this.onEqualPress\n  };\n\n  render() {\n    const {\n      data, className, loading,\n      selection, disabledHover,\n      itemFormatter\n    } = this.props;\n\n    const shortcutsMap = {...this.shortcutsMap, ...this.props.shortcutsMap};\n\n    const classes = classNames(className, {\n      [styles.dataList]: true,\n      [styles.disabledHover]: disabledHover,\n      [styles.multiSelection]: selection.getSelected().size > 0\n    });\n\n    return (\n      <div className={styles.dataListWrapper} data-test=\"ring-data-list\">\n        {this.state.shortcutsEnabled &&\n          (\n            <Shortcuts\n              map={shortcutsMap}\n              scope={this.state.shortcutsScope}\n            />\n          )\n        }\n\n        <ul className={classes}>\n          {data.map(model => {\n            const item = itemFormatter(model);\n            const {id, key, title, items} = item;\n\n            const showMoreLessButton = this.props.itemMoreLessState(item);\n\n            return (\n              <Item\n                key={key || id}\n                item={model}\n                title={title}\n                items={items}\n\n                itemFormatter={itemFormatter}\n\n                collapsible={item.collapsible}\n                collapsed={item.collapsed}\n                onCollapse={item.onCollapse}\n                onExpand={item.onExpand}\n\n                focused={selection.isFocused(model)}\n                showFocus={selection.isFocused(model)}\n                onFocus={this.onItemFocus}\n\n                selection={selection}\n                selectable={item.selectable}\n                selected={selection.isSelected(model)}\n                onSelect={this.onItemSelect}\n\n                showMoreLessButton={showMoreLessButton}\n                onItemMoreLess={this.props.onItemMoreLess}\n              />\n            );\n          })}\n        </ul>\n\n        {loading && (\n          <div className={data.length > 0 ? styles.loadingOverlay : null}>\n            <Loader/>\n          </div>\n        )}\n      </div>\n    );\n  }\n}\n\nexport default disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(DataList)));\n",
  "examples": [
    {
      "name": "Data List",
      "url": "examples/data-list/data-list.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"data-list\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n  padding: 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/data-list/data-list.examples.js';\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Data List with collapsible items",
      "url": "examples/data-list/data-list-with-collapsible-items.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"data-list\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n  padding: 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/data-list/data-list.examples2.js';\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component for rendering interactive hierarchical tables.",
  "attrs": {
    "name": "Data List",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "extends": "{PureComponent}",
    "description": "A component for rendering interactive hierarchical tables.",
    "example-file": "./data-list.examples.html"
  }
};