window.source = {
  "title": "Message",
  "url": "message.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\nimport gift from '@jetbrains/icons/gift.svg';\n\nimport Popup from '../popup/popup';\nimport Icon from '../icon/icon';\nimport Button from '../button/button';\n\nimport styles from './message.css';\n\n/**\n  * @name Message\n  * @category Components\n  * @tags Ring UI Language\n  * @framework React\n  * @constructor\n  * @description Popup with message\n  * @example\n    <example name=\"message\">\n      <file name=\"index.html\">\n        <div id=\"message\"></div>\n      </file>\n\n      <file name=\"index.js\">\n        import React from 'react';\n        import {render} from 'react-dom';\n        import Message from '@jetbrains/ring-ui/components/message/message';\n\n        const container = document.getElementById('message');\n\n        render(\n          <div style={{padding: 200}}>\n            <span>\n              Anchor\n              <Message\n                title=\"This is title\"\n                tailOffset={32}\n              >\n                This is long long long long long long long long long long long long long long long long long long description\n              </Message>\n            </span>\n          </div>,\n          container\n        );\n      </file>\n    </example>\n  */\n\nconst {Directions} = Popup.PopupProps;\n\nconst UNIT = 8;\n\nconst getTailOffsets = offset => ({\n  [Directions.BOTTOM_RIGHT]: {top: 0, left: offset - UNIT, transform: 'rotate(180deg)'},\n  [Directions.BOTTOM_LEFT]: {top: 0, right: offset - UNIT, transform: 'rotate(180deg)'},\n  [Directions.BOTTOM_CENTER]: {top: 0, left: offset - UNIT, transform: 'rotate(180deg)'},\n  [Directions.TOP_RIGHT]: {bottom: -UNIT + 1, left: offset - UNIT},\n  [Directions.TOP_LEFT]: {bottom: -UNIT + 1, right: offset - UNIT},\n  [Directions.TOP_CENTER]: {bottom: -UNIT + 1, left: offset - UNIT},\n  [Directions.RIGHT_TOP]: {bottom: offset - UNIT, left: -UNIT, transform: 'rotate(90deg)'},\n  [Directions.RIGHT_BOTTOM]: {top: offset, left: -UNIT, transform: 'rotate(90deg)'},\n  [Directions.RIGHT_CENTER]: {top: offset, left: -UNIT, transform: 'rotate(90deg)'},\n  [Directions.LEFT_TOP]: {bottom: offset - UNIT, right: -UNIT, transform: 'rotate(-90deg)'},\n  [Directions.LEFT_BOTTOM]: {top: offset, right: -UNIT, transform: 'rotate(-90deg)'},\n  [Directions.LEFT_CENTER]: {top: offset, right: -UNIT, transform: 'rotate(-90deg)'}\n});\n\nexport default class Message extends PureComponent {\n  static Directions = Directions;\n  static PopupProps = Popup.PopupProps;\n\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string,\n    title: PropTypes.string.isRequired,\n    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),\n    direction: PropTypes.string,\n    popupProps: PropTypes.object,\n    tailOffset: PropTypes.number,\n    onClose: PropTypes.func\n  };\n\n  static defaultProps = {\n    icon: gift,\n    direction: Directions.TOP_RIGHT,\n    tailOffset: 56\n  };\n\n  render() {\n    const {\n      children,\n      className,\n      title,\n      icon,\n      direction,\n      tailOffset,\n      popupProps,\n      onClose\n    } = this.props;\n    const classes = classNames(styles.message, className);\n\n    return (\n      <Popup\n        hidden={false}\n        directions={[direction]}\n        className={classes}\n        offset={UNIT * 2}\n        {...popupProps}\n      >\n        <div className={styles.tail} style={getTailOffsets(tailOffset)[direction]}/>\n        {icon && <Icon className={styles.icon} glyph={icon} size={Icon.Size.Size16}/>}\n        <h1 className={styles.title}>{title}</h1>\n        {children && <p className={styles.description}>{children}</p>}\n        <Button className={styles.button} onClick={onClose} primary>{'Got it'}</Button>\n      </Popup>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "message",
      "url": "examples/message/message.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"message\"></div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Message from '@jetbrains/ring-ui/components/message/message';\n\nconst container = document.getElementById('message');\n\nrender(\n  <div style={{padding: 200}}>\n    <span>\n      Anchor\n      <Message\n        title=\"This is title\"\n        tailOffset={32}\n      >\n        This is long long long long long long long long long long long long long long long long long long description\n      </Message>\n    </span>\n  </div>,\n  container\n);\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Popup with message",
  "attrs": {
    "name": "Message",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Popup with message",
    "example": "    <example name=\"message\">\n      <file name=\"index.html\">\n        <div id=\"message\"></div>\n      </file>\n\n      <file name=\"index.js\">\n        import React from 'react';\n        import {render} from 'react-dom';\n        import Message from '@jetbrains/ring-ui/components/message/message';\n\n        const container = document.getElementById('message');\n\n        render(\n          <div style={{padding: 200}}>\n            <span>\n              Anchor\n              <Message\n                title=\"This is title\"\n                tailOffset={32}\n              >\n                This is long long long long long long long long long long long long long long long long long long description\n              </Message>\n            </span>\n          </div>,\n          container\n        );\n      </file>\n    </example>"
  }
};