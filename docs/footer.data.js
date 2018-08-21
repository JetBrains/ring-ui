window.source = {
  "title": "Footer",
  "url": "footer.html",
  "type": "js",
  "content": "/**\n * @name Footer\n * @category Components\n * @tags Ring UI Language\n * @description Displays a configurable page footer.\n *\n * A footer consists of three sections, each optional:\n * - left\n * - center\n * - right\n */\n\n/* eslint-disable react/no-multi-comp */\n\nimport 'dom4';\nimport React, {PureComponent, isValidElement} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Link from '../link/link';\n\nimport styles from './footer.css';\n\n/**\n * @constructor\n * @extends {ReactComponent}\n */\nclass FooterColumn extends PureComponent {\n  static propTypes = {\n    position: PropTypes.string,\n    children: PropTypes.node\n  };\n\n  render() {\n    const {position, children} = this.props;\n    const classes = classNames({\n      [styles.columnLeft]: position === 'left',\n      [styles.columnCenter]: position === 'center',\n      [styles.columnRight]: position === 'right'\n    });\n    return (\n      <div className={classes}>\n        <ul className={styles.columnItem}>\n          {children}\n        </ul>\n      </div>\n    );\n  }\n}\n\n/**\n * Return copyright string\n * @param year {int}\n * @returns {string}\n */\nexport function copyright(year) {\n  const currentYear = (new Date()).getUTCFullYear();\n  const ndash = '–';\n  let ret = 'Copyright © ';\n\n  if (year >= currentYear) {\n    ret += year;\n  } else {\n    ret += year + ndash + currentYear;\n  }\n\n  return ret;\n}\n\n/**\n * @constructor\n * @extends {ReactComponent}\n */\nclass FooterLine extends PureComponent {\n  static propTypes = {\n    item: PropTypes.oneOfType([\n      PropTypes.object,\n      PropTypes.array,\n      PropTypes.string\n    ])\n  };\n\n  render() {\n    const items = Array.isArray(this.props.item) ? this.props.item : [this.props.item];\n\n    function renderItem(item) {\n      if (isValidElement(item)) {\n        return item;\n      }\n\n      const element = (item.copyright ? copyright(item.copyright) : '') + (item.label || item);\n\n      if (item.url) {\n        return (\n          <Link\n            href={item.url}\n            target={item.target}\n            key={item.url + item.title}\n            title={item.title}\n          >{element}</Link>\n        );\n      }\n\n      return element;\n    }\n\n    return (\n      <li className={styles.line}>\n        {items.map(renderItem)}\n      </li>\n    );\n  }\n}\n\n/**\n * @constructor\n * @extends {ReactComponent}\n *\n * @param {string[]} className Additional classnames to assign to the component\n * @param {Object[]} left Left column elements\n * @param {Object[]} center Center column elements\n * @param {Object[]} right Right column elements\n * @returns {React} react component\n *\n * @example\n   <example name=\"Footer\">\n     <file name=\"index.html\" disable-auto-size>\n       <div>\n         <div id=\"footer\"></div>\n       </div>\n     </file>\n     <file name=\"index.css\">\n       body {\n         margin: 0;\n       }\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import React from 'react';\n       import {render} from 'react-dom';\n       import Footer from '@jetbrains/ring-ui/components/footer/footer';\n\n       const footer = (\n         <Footer\n           className=\"stuff\"\n           left={[\n             [{url: 'http://www.jetbrains.com/teamcity/?fromserver', label: 'TeamCity'}, ' by JetBrains'],\n             'Enterprise 8.0.2 EAP (build 27448)'\n           ]}\n           center={[\n             [{copyright: 2000, label: ' JetBrains'}],\n             {url: 'https://teamcity.jetbrains.com/showAgreement.html', label: 'License agreement', title: 'read me!', target: '_blank'}\n           ]}\n           right={[\n             {url: 'http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent', label: 'Feedback'}\n           ]}\n         />\n       );\n       render(footer, document.getElementById('footer'));\n     </file>\n   </example>\n */\nexport default class Footer extends PureComponent {\n  /** @override */\n  static propTypes = {\n    className: PropTypes.string,\n    floating: PropTypes.bool,\n    left: PropTypes.array,\n    center: PropTypes.array,\n    right: PropTypes.array\n  };\n\n  render() {\n    const {floating} = this.props;\n\n    function content(elements, position) {\n      if (!elements) {\n        return false;\n      }\n\n      return (\n        <FooterColumn\n          key={position}\n          position={position}\n        >\n          {elements.map((item, idx) => (\n            <FooterLine\n              // eslint-disable-next-line react/no-array-index-key\n              key={idx}\n              item={item}\n            />\n          ))}\n        </FooterColumn>\n      );\n    }\n\n    const classes = classNames(styles.footer, this.props.className, {\n      [styles.footerFloating]: floating\n    });\n\n    return (\n      <div\n        className={classes}\n        data-test=\"ring-footer\"\n      >{\n          [\n            content(this.props.left, 'left'),\n            content(this.props.center, 'center'),\n            content(this.props.right, 'right')\n          ]\n        }</div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Footer",
      "url": "examples/footer/footer.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"footer\"></div>\n</div>\n     ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n}\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport Footer from '@jetbrains/ring-ui/components/footer/footer';\n\nconst footer = (\n  <Footer\n    className=\"stuff\"\n    left={[\n      [{url: 'http://www.jetbrains.com/teamcity/?fromserver', label: 'TeamCity'}, ' by JetBrains'],\n      'Enterprise 8.0.2 EAP (build 27448)'\n    ]}\n    center={[\n      [{copyright: 2000, label: ' JetBrains'}],\n      {url: 'https://teamcity.jetbrains.com/showAgreement.html', label: 'License agreement', title: 'read me!', target: '_blank'}\n    ]}\n    right={[\n      {url: 'http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent', label: 'Feedback'}\n    ]}\n  />\n);\nrender(footer, document.getElementById('footer'));\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a configurable page footer.\n\nA footer consists of three sections, each optional:\n- left\n- center\n- right",
  "attrs": {
    "name": "Footer",
    "category": "Components",
    "tags": "Ring UI Language",
    "description": "Displays a configurable page footer.\n\nA footer consists of three sections, each optional:\n- left\n- center\n- right"
  }
};