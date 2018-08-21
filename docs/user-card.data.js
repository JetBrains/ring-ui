window.source = {
  "title": "User Card",
  "url": "user-card.html",
  "type": "js",
  "content": "\n/**\n * @name User Card\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description A component that displays user details.\n * @example-file ./user-card.examples.html\n */\n\nexport {default as UserCard} from './card';\nexport {default as UserCardTooltip} from './tooltip';\nexport {default as SmartUserCardTooltip} from './smart-user-card-tooltip';\n",
  "examples": [
    {
      "name": "User Card",
      "url": "examples/user-card/user-card.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport {UserCard, UserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nconst user = {\n  login: 'testuser',\n  name: 'Test User',\n  email: 'testuser@mail.com',\n  avatarUrl: `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`,\n  href: `${hubConfig.serverUri}/users/0`\n};\n\nclass UserCardDemo extends Component {\n render() {\n   return (\n     <div>\n       <div>Inline user card:</div>\n       <UserCard user={user} data-test=\"user-card-inline\"/>\n\n       <UserCardTooltip user={user}>\n         <span>Hover this text see card in tooltip mode</span>\n       </UserCardTooltip>\n     </div>\n   );\n }\n}\n\nrender(<UserCardDemo />, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Smart User Card Tooltip",
      "url": "examples/user-card/smart-user-card-tooltip.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport {SmartUserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';\n\nconst user = {\n  login: 'testuser',\n  name: 'Test User',\n  email: 'testuser@mail.com',\n  avatarUrl: `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`,\n  href: `${hubConfig.serverUri}/users/0`,\n  banned: true,\n  online: false,\n  banReason: 'Bad guy: is accused of stealing potatoes'\n};\n\nasync function loadUser() {\n  return new Promise(resolve => setTimeout(resolve, 10000)).\n    then(() => user);\n}\n\nclass UserCardDemo extends Component {\n  render() {\n    return (\n      <div>\n        <SmartUserCardTooltip userDataSource={loadUser}>\n          <span>Hover this text load user information</span>\n        </SmartUserCardTooltip>\n      </div>\n    );\n  }\n}\n\nrender(<UserCardDemo />, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Hub User Card",
      "url": "examples/user-card/hub-user-card.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport {SmartUserCardTooltip} from '@jetbrains/ring-ui/components/user-card/user-card';\nimport {createHubUserCardSource} from '@jetbrains/ring-ui/components/hub-source/hub-source__user.js';\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\n(async function () {\n  const auth = new Auth(hubConfig);\n  await auth.init();\n\n  const userSource = createHubUserCardSource(auth, auth.user.id);\n\n  class UserCardDemo extends Component {\n    render() {\n      return (\n        <div>\n          <SmartUserCardTooltip userDataSource={userSource}>\n            <span>Hover this text load user information</span>\n          </SmartUserCardTooltip>\n        </div>\n      );\n    }\n  }\n\n  render(<UserCardDemo />, document.getElementById('demo'));\n})();\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component that displays user details.",
  "attrs": {
    "name": "User Card",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "A component that displays user details.",
    "example-file": "./user-card.examples.html"
  }
};