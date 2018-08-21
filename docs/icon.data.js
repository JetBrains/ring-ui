window.source = {
  "title": "Icon",
  "url": "icon.html",
  "type": "js",
  "content": "/**\n * @name Icon\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays an icon.\n * @extends {ReactComponent}\n * @example-file ./icon.examples.html\n */\n\nimport 'core-js/modules/es6.array.find';\nimport React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport {resolveRelativeURL} from '../global/url';\n\nimport {Color, Size} from './icon__constants';\nimport styles from './icon.css';\n\nexport default class Icon extends PureComponent {\n  static Color = Color;\n  static Size = Size;\n\n  static propTypes = {\n    className: PropTypes.string,\n    color: PropTypes.string,\n    glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),\n    height: PropTypes.number,\n    size: PropTypes.number,\n    width: PropTypes.number,\n    loading: PropTypes.bool\n  };\n\n  static defaultProps = ({\n    className: '',\n    color: Color.DEFAULT,\n    glyph: '',\n    size: Size.Size32\n  });\n\n  render() {\n    const {className, size, color, loading, glyph, width, height, ...restProps} = this.props;\n\n    const classes = classNames(styles.icon,\n      {\n        [styles[color]]: !!color,\n        [styles.loading]: loading\n      },\n      className\n    );\n\n    const style = (width || height)\n      ? {width, height}\n      : {\n        width: size,\n        height: size\n      };\n\n    const xlinkHref = resolveRelativeURL(glyph);\n\n    return (\n      <span\n        {...restProps}\n        className={classes}\n      >\n        <svg\n          className={styles.glyph}\n          style={style}\n        >\n          <use xlinkHref={xlinkHref}/>\n        </svg>\n      </span>\n    );\n  }\n}\n\nexport {Size};\n\nexport function iconHOC(glyph, displayName) {\n  // eslint-disable-next-line react/no-multi-comp\n  return class BoundIcon extends PureComponent {\n    static Color = Color;\n    static Size = Size;\n\n    static toString() {\n      return glyph;\n    }\n\n    static displayName = displayName;\n\n    static propTypes = {\n      iconRef: PropTypes.func\n    };\n\n    render() {\n      const {iconRef, ...restProps} = this.props;\n      return <Icon ref={iconRef} {...restProps} glyph={glyph}/>;\n    }\n  };\n}\n",
  "examples": [
    {
      "name": "Icon",
      "url": "examples/icon/icon.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"some-icons\">\n  <span id=\"icon-container\"></span>\n  <span id=\"icon-search\"></span>\n  <span id=\"icon-16-pencil\"></span>\n  <span id=\"icon-14-pencil\"></span>\n  <span id=\"icon-custom-permission\"></span>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.ring-icon) {\n  margin: 8px;\n  padding: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport {\n  SearchIcon,\n  CheckmarkIcon,\n  PencilIcon,\n  PermissionIcon\n} from '@jetbrains/ring-ui/components/icon';\n\nrender(\n  <CheckmarkIcon\n    className=\"additional-class ring-icon\"\n    color={CheckmarkIcon.Color.MAGENTA}\n    size={CheckmarkIcon.Size.Size32}\n  />,\n  document.getElementById('icon-container')\n);\n\nrender(\n  <SearchIcon\n    className=\"ring-icon\"\n    size={SearchIcon.Size.Size32}\n  />,\n  document.getElementById('icon-search')\n);\n\nrender(\n  <PencilIcon\n    className=\"ring-icon\"\n    size={PencilIcon.Size.Size16}\n  />,\n  document.getElementById('icon-16-pencil')\n);\n\nrender(\n  <PencilIcon\n    className=\"ring-icon\"\n    size={PencilIcon.Size.Size14}\n  />,\n  document.getElementById('icon-14-pencil')\n);\n\nrender(\n  <PermissionIcon\n    className=\"ring-icon\"\n    height={80}\n    width={100}\n  />,\n  document.getElementById('icon-custom-permission')\n);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Icons list",
      "url": "examples/icon/icons-list.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<h3>All available icons are listed below. Place the cursor over an icon to\n  see its name.</h3>\n<div id=\"all-icons\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n@value unit, link-color, link-hover-color from '../global/global.css';\n\n:global(.icon-example__container) {\n  margin-left: calc(0 - calc(unit * 2));\n}\n\n:global(.ring-icon) {\n  margin: 8px;\n  padding: 8px;\n  color: link-color;\n}\n\n:global(.secondary) {\n  fill: link-hover-color;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport 'core-js/modules/es7.object.values';\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport * as icons from '@jetbrains/ring-ui/components/icon/icons';\n\nrender(\n  <div className=\"icon-example__container\">\n    {Object.values(icons).map(Icon => (\n      <Icon\n        key={Icon}\n        title={Icon.displayName}\n        className=\"ring-icon\"\n      />\n    ))}\n  </div>,\n  document.getElementById('all-icons')\n);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "List of JetBrains product logos",
      "url": "examples/icon/list-of-jet-brains-product-logos.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"logos\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.ring-icon) {\n  color: black;\n  margin: 8px;\n  padding: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport 'core-js/modules/es7.object.values';\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport * as logos from '@jetbrains/ring-ui/components/icon/logos';\n\nrender(\n  <div>\n    {Object.values(logos).map(Logo => (\n      <Logo\n        key={Logo}\n        title={Logo.displayName}\n        size={Logo.Size.Size128}\n        className=\"ring-icon\"\n      />\n    ))}\n  </div>,\n  document.getElementById('logos')\n);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an icon.",
  "attrs": {
    "name": "Icon",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays an icon.",
    "extends": "{ReactComponent}",
    "example-file": "./icon.examples.html"
  }
};