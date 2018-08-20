window.source = {
  "title": "Content Layout",
  "url": "content-layout.html",
  "type": "js",
  "content": "import React, {cloneElement, Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Sidebar from './sidebar';\nimport styles from './content-layout.css';\n\n/**\n * @name Content Layout\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A component for simple content layout.\n * @example-file ./content-layout.examples.html\n */\n\nexport default class ContentLayout extends Component {\n  static propTypes = {\n    children: PropTypes.node,\n    className: PropTypes.string,\n    contentClassName: PropTypes.string,\n    responsive: PropTypes.bool\n  };\n\n  static defaultProps = {\n    responsive: true\n  };\n\n  state = {};\n\n  saveContentNode = contentNode => {\n    this.setState({contentNode});\n  };\n\n  render() {\n    const {children, className, contentClassName, responsive, ...restProps} = this.props;\n\n    const classes = classNames(styles.contentLayout, className, {\n      [styles.contentLayoutResponsive]: responsive\n    });\n\n    const contentClasses = classNames(styles.contentLayoutContent, contentClassName);\n\n    const childrenArray = React.Children.toArray(children);\n    const sidebarChild = childrenArray.filter(child => child && child.type === Sidebar)[0];\n\n    const sidebar = sidebarChild && cloneElement(sidebarChild, {\n      contentNode: this.state.contentNode\n    });\n    const contentChildren = childrenArray.filter(child => child !== sidebarChild);\n\n    return (\n      <div\n        {...restProps}\n        className={classes}\n      >\n        {sidebar}\n        <div\n          className={contentClasses}\n          ref={this.saveContentNode}\n        >\n          {contentChildren}\n        </div>\n      </div>\n    );\n  }\n}\n\nexport {default as Sidebar} from './sidebar';\n",
  "examples": [
    {
      "name": "Content Layout",
      "url": "examples/content-layout/content-layout.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:root body {\n  margin: 0;\n  padding: 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport ContentLayout from '@jetbrains/ring-ui/components/content-layout/content-layout';\n\nconst renderLayoutDemo = () => (\n  <ContentLayout>\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </ContentLayout>\n);\n\nrender(renderLayoutDemo(), document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Content Layout with sidebar on the left",
      "url": "examples/content-layout/content-layout-with-sidebar-on-the-left.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:root body {\n  margin: 0;\n  padding: 0;\n}\n\n:global(.sidebar) {\n  background-color: #EEEEEE;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport ContentLayout from '@jetbrains/ring-ui/components/content-layout/content-layout';\nimport Sidebar from '@jetbrains/ring-ui/components/content-layout/sidebar';\n\nconst renderLayoutDemo = () => (\n <div>\n   <div>\n     <h4>Some title</h4>\n   </div>\n   <ContentLayout>\n     <Sidebar className=\"sidebar\">\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n     </Sidebar>\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n   </ContentLayout>\n   <div>Some content below. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>\n   <div>Some content below. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>\n   <div>Some content below. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>\n </div>\n);\n\nrender(renderLayoutDemo(), document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Content Layout with sidebar on the right",
      "url": "examples/content-layout/content-layout-with-sidebar-on-the-right.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:root body {\n  margin: 0;\n  padding: 0;\n}\n\n:global(.sidebar) {\n  background-color: #EEEEEE;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\n import {render} from 'react-dom';\n import React from 'react';\n\n import ContentLayout from '@jetbrains/ring-ui/components/content-layout/content-layout';\n import Sidebar from '@jetbrains/ring-ui/components/content-layout/sidebar';\n\n const renderLayoutDemo = () => (\n   <div>\n     <div>\n       <h4>Some title</h4>\n     </div>\n     <ContentLayout>\n       <Sidebar className=\"sidebar\" right>\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n         This is sidebar. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n       </Sidebar>\n       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n     </ContentLayout>\n    <div>Some content below. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>\n    <div>Some content below. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>\n    <div>Some content below. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>\n </div>\n);\n\n render(renderLayoutDemo(), document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component for simple content layout.",
  "attrs": {
    "name": "Content Layout",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A component for simple content layout.",
    "example-file": "./content-layout.examples.html"
  }
};