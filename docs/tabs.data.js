window.source = {
  "title": "Tabs",
  "url": "tabs.html",
  "type": "js",
  "content": "/**\n * @name Tabs\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Displays a tab set\n * @example-file ./tabs.examples.html\n */\n\nexport {default as Tabs} from './dumb-tabs';\nexport {default as SmartTabs} from './smart-tabs';\nexport {default as Tab} from './tab';\n",
  "examples": [
    {
      "name": "Tabs",
      "url": "examples/tabs/tabs.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"tabs\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport {Tabs, Tab} from '@jetbrains/ring-ui/components/tabs/tabs';\n\nconst container = document.getElementById('tabs');\n\nclass TabsExample extends Component {\n  state = {selected: 'first'};\n\n  render() {\n    return (\n      <Tabs\n        selected={this.state.selected}\n        onSelect={selected => this.setState({selected})}\n      >\n        <Tab\n          id=\"first\"\n          title=\"First tab\"\n        >\n          First tab content\n        </Tab>\n        <Tab\n          id=\"second\"\n          title=\"Second tab\"\n        >\n          Second tab content\n        </Tab>\n        <Tab\n          id=\"third\"\n          title=\"Third tab\"\n        >\n          Third tab content\n        </Tab>\n        <Tab\n          disabled\n          id=\"disabled\"\n          title=\"Disabled tab\"\n        >\n          Disabled tab content\n        </Tab>\n      </Tabs>\n    );\n  }\n}\n\nrender(<TabsExample />, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Dark Tabs",
      "url": "examples/tabs/dark-tabs.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"dark\" class=\"dark-wrapper\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.dark-wrapper) {\n  background: #000;\n  padding: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport {Tabs, Tab} from '@jetbrains/ring-ui/components/tabs/tabs';\n\nconst container = document.getElementById('dark');\n\nclass TabsExample extends Component {\nstate = {selected: 'first'};\n\nrender() {\n  return (\n    <Tabs\n      selected={this.state.selected}\n      onSelect={selected => this.setState({selected})}\n      theme={Tabs.Theme.DARK}\n    >\n      <Tab\n        id=\"first\"\n        title=\"First tab\"\n      >\n        First tab content\n      </Tab>\n      <Tab\n        id=\"second\"\n        title=\"Second tab\"\n      >\n        Second tab content\n      </Tab>\n      <Tab\n        id=\"third\"\n        title=\"Third tab\"\n      >\n        Third tab content\n      </Tab>\n      <Tab\n        disabled\n        id=\"disabled\"\n        title=\"Disabled tab\"\n      >\n        Disabled tab content\n      </Tab>\n    </Tabs>\n  );\n  }\n}\n\nrender(<TabsExample />, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Smart tabs",
      "url": "examples/tabs/smart-tabs.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"tabs\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport {SmartTabs, Tab} from '@jetbrains/ring-ui/components/tabs/tabs';\n\nconst container = document.getElementById('tabs');\n\nconst tabs = (\n  <SmartTabs>\n    <Tab title=\"First tab\">\n      First tab content\n    </Tab>\n    <Tab title=\"Second tab\">\n      Second tab content\n    </Tab>\n    <Tab title=\"Third tab\">\n      Third tab content\n    </Tab>\n    <Tab\n      disabled\n      title=\"Disabled tab\"\n    >\n      Disabled tab content\n    </Tab>\n  </SmartTabs>\n);\n\nrender(tabs, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Custom titles",
      "url": "examples/tabs/custom-titles.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"tabs\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.icon.icon) {\n  vertical-align: 3px;\n  line-height: normal;\n  margin-right: 4px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport {SmartTabs, Tab} from '@jetbrains/ring-ui/components/tabs/tabs';\nimport {SearchIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon';\n\nconst container = document.getElementById('tabs');\n\nfunction Title({Icon, children}) {\n  return (\n    <span>\n      <Icon\n        className=\"icon\"\n        size={Icon.Size.Size16}\n      />\n      {children}\n    </span>\n  );\n}\n\nconst tabs = (\n  <SmartTabs>\n    <Tab title={<Title Icon={SearchIcon}>First tab</Title>}>\n      First tab content\n    </Tab>\n    <Tab title={<Title Icon={WarningIcon}>Second tab</Title>}>\n      Second tab content\n    </Tab>\n  </SmartTabs>\n);\n\nrender(tabs, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Custom titles (function)",
      "url": "examples/tabs/custom-titles-function.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"tabs\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.icon.icon) {\n  vertical-align: 3px;\n  line-height: normal;\n  @nest :global(.has-content) & {\n    margin-right: 4px;\n  }\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport {SmartTabs, Tab} from '@jetbrains/ring-ui/components/tabs/tabs';\nimport {SearchIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon';\n\nconst container = document.getElementById('tabs');\n\nfunction Title({Icon, children}) {\n  return (\n    <span className={children ? 'has-content' : ''}>\n      <Icon\n        className=\"icon\"\n        size={Icon.Size.Size16}\n      />\n      {children}\n    </span>\n  );\n}\n\nconst tabs = (\n  <SmartTabs>\n    <Tab title={isSelected => <Title Icon={SearchIcon}>{isSelected && \"First tab\"}</Title>}>\n      First tab content\n    </Tab>\n    <Tab title={isSelected => <Title Icon={WarningIcon}>{isSelected && \"Second tab\"}</Title>}>\n      Second tab content\n    </Tab>\n  </SmartTabs>\n);\n\nrender(tabs, container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a tab set",
  "attrs": {
    "name": "Tabs",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Displays a tab set",
    "example-file": "./tabs.examples.html"
  }
};