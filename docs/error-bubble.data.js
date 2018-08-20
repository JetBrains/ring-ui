window.source = {
  "title": "Error Bubble",
  "url": "error-bubble.html",
  "type": "js",
  "content": "import React, {Children, cloneElement, PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Popup from '../popup/popup';\nimport {Directions} from '../popup/position';\n\nimport styles from './error-bubble.css';\n/**\n * @name Error Bubble\n * @category Components\n * @constructor\n * @description Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop.\n * Passes any prop except `className` down to input.\n * @example-file ./error-bubble.examples.html\n */\n\nexport default class ErrorBubble extends PureComponent {\n  static propTypes = {\n    error: PropTypes.string,\n    className: PropTypes.string,\n    children: PropTypes.node\n  };\n\n  render() {\n    const {children, className, ...restProps} = this.props;\n\n    const errorBubbleClasses = classNames(styles.errorBubble, className);\n\n    return (\n      <div className={styles.errorBubbleWrapper}>\n        {Children.map(children, child => cloneElement(child, restProps))}\n\n        {restProps.error && (\n          <Popup\n            className={styles.errorBubblePopup}\n            hidden={false}\n            attached={false}\n            directions={[Directions.RIGHT_CENTER, Directions.RIGHT_BOTTOM, Directions.RIGHT_TOP]}\n          >\n            <div\n              className={errorBubbleClasses}\n              data-test=\"ring-error-bubble\"\n            >\n              {restProps.error}\n            </div>\n          </Popup>\n        )}\n      </div>\n    );\n  }\n}\n\n",
  "examples": [
    {
      "name": "Error Bubble",
      "url": "examples/error-bubble/error-bubble.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"container\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport ErrorBubble from '@jetbrains/ring-ui/components/error-bubble/error-bubble';\nimport Input, {Size} from '@jetbrains/ring-ui/components/input/input';\nimport '@jetbrains/ring-ui/components/input-size/input-size.scss';\n\nconst container = document.getElementById('container');\nconst renderBubbleDemo = value => (\n  <ErrorBubble\n    error={value ? null : 'Value is required'}\n    onInput={e => render(renderBubbleDemo(e.target.value), container)}\n    placeholder=\"enter something\"\n  >\n    <Input borderless size={Size.M}/>\n  </ErrorBubble>\n);\n\nrender(renderBubbleDemo(), container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Error Bubble In Dialog Form",
      "url": "examples/error-bubble/error-bubble-in-dialog-form.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"container\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\n\nimport ErrorBubble from '@jetbrains/ring-ui/components/error-bubble/error-bubble';\nimport Input, {Size} from '@jetbrains/ring-ui/components/input/input';\nimport Dialog from '@jetbrains/ring-ui/components/dialog/dialog';\nimport {Header, Content} from '@jetbrains/ring-ui/components/island/island';\nimport '@jetbrains/ring-ui/components/form/form.scss';\nimport '@jetbrains/ring-ui/components/input-size/input-size.scss';\n\nconst container = document.getElementById('container');\nconst renderBubbleDemo = value => (\n<Dialog show>\n  <Header>Dialog example</Header>\n  <Content>\n    <form className=\"ring-form\">\n      <div className=\"ring-form__group\">\n        <label className=\"ring-form__label\">Field name</label>\n        <div className=\"ring-form__control ring-form__control_small\">\n          <ErrorBubble\n            error={value ? null : 'Value is required'}\n            onInput={e => render(renderBubbleDemo(e.target.value), container)}\n            placeholder=\"enter something\"\n          >\n            <Input borderless size={Size.M}/>\n          </ErrorBubble>\n        </div>\n      </div>\n    </form>\n  </Content>\n</Dialog>\n);\n\nrender(renderBubbleDemo(), container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop.\nPasses any prop except `className` down to input.",
  "attrs": {
    "name": "Error Bubble",
    "category": "Components",
    "constructor": "",
    "description": "Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop.\nPasses any prop except `className` down to input.",
    "example-file": "./error-bubble.examples.html"
  }
};