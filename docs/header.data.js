window.source = {
  "title": "Header",
  "url": "header.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport rerenderHOC from '../global/rerender-hoc';\nimport Theme from '../global/theme';\n\nimport styles from './header.css';\n\n/**\n * @name Header\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Displays a configurable page header.\n * @example-file ./header.examples.html\n */\n\nexport default class Header extends Component {\n  static propTypes = {\n    className: PropTypes.string,\n    children: PropTypes.node,\n    spaced: PropTypes.bool,\n    theme: PropTypes.string\n  };\n\n  static defaultProps = {\n    spaced: true,\n    theme: Theme.DARK\n  };\n\n  render() {\n    const {children, className, spaced, theme, ...restProps} = this.props;\n    const classes = classNames(styles.header, styles[theme], className, {\n      [styles.headerSpaced]: spaced\n    });\n\n    return (\n      <div\n        {...restProps}\n        className={classes}\n      >\n        {children}\n      </div>\n    );\n  }\n}\n\nexport const RerenderableHeader = rerenderHOC(Header);\nexport {default as Logo} from './logo';\nexport {default as Tray} from './tray';\nexport {default as TrayIcon} from './tray-icon';\nexport {default as Profile} from './profile';\nexport {default as SmartProfile} from './smart-profile';\nexport {default as Services} from './services';\nexport {default as SmartServices} from './smart-services';\n",
  "examples": [
    {
      "name": "Header",
      "url": "examples/header/header.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"header\"></div>\n<div class=\"page-content\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n/* override common styles */\n:root body {\n  margin: 0;\n  background: #e8e8e9;\n}\n\n:global(.page-content) {\n  background: #FFF;\n  padding: 32px;\n  height: 370px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport hubLogo from '@jetbrains/logos/hub/hub.svg';\nimport {DragIcon, ExpandIcon} from '@jetbrains/ring-ui/components/icon';\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport showAuthDialog from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';\nimport Header, {Logo, Tray, TrayIcon, SmartProfile, SmartServices} from '@jetbrains/ring-ui/components/header/header';\nimport Link from '@jetbrains/ring-ui/components/link/link';\nimport Input from '@jetbrains/ring-ui/components/input/input';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nconst container = document.getElementById('header');\nconst auth = new Auth(hubConfig);\nauth.setAuthDialogService(showAuthDialog);\nauth.init();\n\nconst Comp = props => <a {...props}>This is component</a>;\n\nconst renderHeaderDemo = () => (\n  <Header>\n    <a href=\"/\">\n      <Logo glyph={hubLogo} size={Logo.Size.Size48} />\n    </a>\n    <Link active href=\"#\">Users</Link>\n    <Link href=\"#\">Groups</Link>\n    <Link href=\"#\">Spaces</Link>\n    <Link href=\"#\">Services</Link>\n    <Tray>\n      <TrayIcon\n        primary\n        title=\"Create issue\"\n        icon={ExpandIcon}\n      />\n      <Dropdown\n        anchor={({active}) => (\n          <TrayIcon\n            active={active}\n            icon={DragIcon}\n          />\n        )}\n      >\n        <PopupMenu\n          top={-12}\n          closeOnSelect\n          data={[\n            {label: 'Test'},\n            {label: 'Test2'}\n          ]}\n        />\n      </Dropdown>\n      <SmartServices auth={auth} />\n      <SmartProfile\n        auth={auth}\n        hasUpdates\n        LinkComponent={Comp}\n      />\n    </Tray>\n  </Header>\n);\n\nrender(renderHeaderDemo(), container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Light header",
      "url": "examples/header/light-header.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"header\"></div>\n<div></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n/* override common styles */\n:root body {\n  margin: 0;\n  background: #f7f9fa;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport hubLogo from '@jetbrains/logos/hub/hub.svg';\nimport {DragIcon, ExpandIcon} from '@jetbrains/ring-ui/components/icon';\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport Theme from '@jetbrains/ring-ui/components/global/theme';\nimport Header, {Logo, Tray, TrayIcon, SmartProfile, SmartServices} from '@jetbrains/ring-ui/components/header/header';\nimport Link from '@jetbrains/ring-ui/components/link/link';\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nconst container = document.getElementById('header');\nconst auth = new Auth(hubConfig);\nauth.init();\n\nconst Comp = props => <a {...props}>This is component</a>;\n\nconst renderHeaderDemo = () => (\n  <Header theme={Theme.LIGHT}>\n    <a href=\"/\">\n      <Logo glyph={hubLogo} size={Logo.Size.Size48} />\n    </a>\n    <Link active href=\"#\">Users</Link>\n    <Link href=\"#\">Groups</Link>\n\n    <Tray>\n      <Dropdown\n        anchor={({active}) => (\n          <TrayIcon\n            active={active}\n            icon={DragIcon}\n          />\n        )}\n      >\n      <PopupMenu\n        top={-12}\n        closeOnSelect\n        data={[\n          {label: 'Test'},\n          {label: 'Test2'}\n        ]}\n      />\n      </Dropdown>\n      <SmartServices auth={auth} />\n      <SmartProfile\n        auth={auth}\n        hasUpdates\n        LinkComponent={Comp}\n      />\n    </Tray>\n  </Header>\n);\n\nrender(renderHeaderDemo(), container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Low header",
      "url": "examples/header/low-header.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"header\"></div>\n<div class=\"page-content\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0 !important;\n  background: #e8e8e9;\n}\n\n:global(.page-content) {\n  background: #FFF;\n  padding: 32px;\n  height: 394px;\n}\n\n/* override Header */\n:global(.header.header) {\n  height: 40px;\n}\n\n:global(.logo.logo) {\n  color: #fff;\n  position: relative;\n  top: -2px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport hubLogo from '@jetbrains/logos/hub/hub-text.svg';\nimport {DragIcon, ExpandIcon} from '@jetbrains/ring-ui/components/icon';\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport Header, {Logo, Tray, TrayIcon, SmartProfile, SmartServices} from '@jetbrains/ring-ui/components/header/header';\nimport Link from '@jetbrains/ring-ui/components/link/link';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';\nimport PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';\n\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nconst container = document.getElementById('header');\nconst auth = new Auth(hubConfig);\nauth.init();\n\nconst renderHeaderDemo = () => (\n  <Header className=\"header\">\n    <a href=\"/\" >\n      <Logo className=\"logo\" glyph={hubLogo} size={Logo.Size.Size96} />\n    </a>\n    <Link active href=\"#\">Users</Link>\n    <Link href=\"#\">Groups</Link>\n    <Link href=\"#\">Spaces</Link>\n    <Link href=\"#\">Services</Link>\n    <Tray>\n      <TrayIcon\n        primary\n        title=\"Create issue\"\n        icon={ExpandIcon}\n      />\n      <Dropdown\n        anchor={({active}) => (\n          <TrayIcon\n            active={active}\n            icon={DragIcon}\n          />\n        )}\n      >\n        <PopupMenu\n          top={-12}\n          closeOnSelect\n          data={[\n            {label: 'Test'},\n            {label: 'Test2'}\n          ]}\n        />\n      </Dropdown>\n      <SmartServices auth={auth} />\n      <SmartProfile\n        auth={auth}\n        hasUpdates\n        size={SmartProfile.Size.Size24}\n      />\n    </Tray>\n  </Header>\n);\n\nrender(renderHeaderDemo(), container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a configurable page header.",
  "attrs": {
    "name": "Header",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Displays a configurable page header.",
    "example-file": "./header.examples.html"
  }
};