window.source = {
  "title": "Button",
  "url": "button.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\nimport chevronDown from '@jetbrains/icons/chevron-down.svg';\n\nimport Icon, {Size} from '../icon';\nimport Theme from '../global/theme';\nimport ClickableLink from '../link/clickableLink';\n\nimport styles from './button.css';\n\n/**\n * @name Button\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Provides styled buttons.\n * @extends {PureComponent}\n * @example-file ./button.examples.html\n */\nexport default class Button extends PureComponent {\n  static IconSize = Size;\n  static Theme = Theme;\n\n  static propTypes = {\n    theme: PropTypes.string,\n    active: PropTypes.bool,\n    danger: PropTypes.bool,\n    delayed: PropTypes.bool,\n    loader: PropTypes.bool,\n    primary: PropTypes.bool,\n    blue(props, propName) {\n      if (propName in props) {\n        return new Error(`\"${propName}\" prop is deprecated. Use \"primary\" instead`);\n      }\n      return undefined;\n    },\n    short: PropTypes.bool,\n    text: PropTypes.bool,\n    inline: PropTypes.bool,\n    dropdown: PropTypes.bool,\n\n    href: PropTypes.string,\n\n    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),\n    iconSize: PropTypes.number,\n    iconClassName: PropTypes.string,\n\n    className: PropTypes.string,\n    onMouseDown: PropTypes.func,\n\n    children: PropTypes.node\n  };\n\n  static defaultProps = {\n    theme: Theme.LIGHT,\n    iconSize: Size.Size16,\n    onMouseDown() {}\n  };\n\n  onMouseDown = e => {\n    e.preventDefault();\n    this.props.onMouseDown(e);\n  };\n\n  render() {\n    const {\n      // Modifiers\n      theme,\n      active,\n      blue,\n      danger,\n      delayed,\n      loader,\n      primary,\n      short,\n      text,\n      inline,\n      dropdown,\n\n      // Props\n      icon,\n      iconSize,\n      iconClassName,\n      className,\n      children,\n      onMouseDown, // eslint-disable-line no-unused-vars\n      ...props\n    } = this.props;\n\n    const classes = classNames(\n      styles.button,\n      className,\n      styles[theme],\n      {\n        [styles.active]: active,\n        [styles.danger]: danger,\n        [styles.delayed]: delayed,\n        [styles.withIcon]: icon,\n        [styles.onlyIcon]: icon && !children,\n        [styles.withNormalIconLight]: (\n          icon && !active && !danger && !primary && theme === Theme.LIGHT\n        ),\n        [styles.withDangerIconLight]: (\n          icon && danger && theme === Theme.LIGHT\n        ),\n        [styles.loader]: loader && !icon,\n        [styles.primary]: primary || blue,\n        [styles.short]: short,\n        [styles.text]: text,\n        [styles.inline]: inline\n      }\n    );\n\n    const content = (\n      <span className={styles.content}>\n        {icon && (\n          <span className={classNames(styles.icon, iconClassName)}>\n            <Icon\n              glyph={icon}\n              size={iconSize}\n              loading={loader}\n            />\n          </span>\n        )}\n        {children && (\n          <span>{children}</span>\n        )}\n        {dropdown && (\n          <Icon\n            glyph={chevronDown}\n            size={Icon.Size.Size14}\n            className={styles.dropdownIcon}\n          />\n        )}\n      </span>\n    );\n    const isLink = !!props.href;\n\n    const Tag = isLink ? ClickableLink : 'button';\n    return (\n      <Tag\n        tabIndex={loader ? -1 : 0}\n        type={isLink ? null : 'button'}\n        {...props}\n        onMouseDown={this.onMouseDown}\n        className={classes}\n      >\n        {loader && !icon && <div className={styles.loaderBackground}/>}\n        {content}\n      </Tag>\n    );\n  }\n}\n\nexport {Size as IconSize};\n",
  "examples": [
    {
      "name": "Button",
      "url": "examples/button/button.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "css",
          "content": "\n:global(.buttons) > button {\n  margin: 8px;\n}\n\n:global(.dark) {\n  background: #000;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"buttons\"></div>\n<div id=\"dark\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Fragment} from 'react';\nimport {render} from 'react-dom';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport {PencilIcon} from '@jetbrains/ring-ui/components/icon';\n\nfunction renderButtonModifications(theme) {\n  return [\n    'active', 'primary', 'danger', 'delayed', 'disabled', 'dropdown'\n  ].map(modifier => (\n    <Button\n      theme={theme}\n      key={modifier}\n      {...{[modifier]: true}}\n    >Button {modifier}</Button>\n  ));\n}\n\nfunction renderTextModifications(theme) {\n  return [\n    'primary', 'danger', 'disabled'\n  ].map(modifier => (\n     <Button\n       text\n       theme={theme}\n       key={modifier}\n       {...{[modifier]: true}}\n     >Text action {modifier}</Button>\n  ));\n}\n\nfunction renderIconWithTextModifications(theme) {\n  return [\n    {label: 'primary', primary: true},\n    {label: 'danger', danger: true},\n    {label: 'disabled', disabled: true},\n    {label: 'primary-disabled', primary: true, disabled: true},\n    {label: 'danger-disabled', danger: true, disabled: true}\n  ].map((modifiers, index) => (\n     <Button\n       theme={theme}\n       key={index}\n       icon={PencilIcon}\n       {...modifiers}\n     >Icon action {modifiers.label}</Button>\n  ));\n}\n\nfunction renderIconActionModifications(theme) {\n  return [\n    {label: 'primary', primary: true},\n    {label: 'danger', danger: true},\n    {label: 'disabled', disabled: true},\n    {label: 'primary-disabled', primary: true, disabled: true},\n    {label: 'danger-disabled', danger: true, disabled: true}\n  ].map((modifiers, index) => (\n    <Button\n      theme={theme}\n      key={index}\n      title={`Just icon action (${modifiers.label})`}\n      icon={PencilIcon}\n      {...modifiers}\n    />\n  ));\n}\n\nconst buttons = (\n  <div className=\"buttons\">\n    <Button>Button default</Button>\n\n    <Button\n      short\n    >...</Button>\n\n    <Button\n      href=\"/\"\n    >Button link</Button>\n\n    <Button\n      loader\n    >Button loader</Button>\n\n    <Button\n      primary\n      loader\n    >Primary loader</Button>\n\n    <Button\n      icon={PencilIcon}\n      loader\n    >Icon loader</Button>\n\n    {renderButtonModifications()}\n\n    <Button\n      text\n    >Text action</Button>\n\n    {renderTextModifications()}\n\n    <Button\n      icon={PencilIcon}\n    >Icon action</Button>\n\n    {renderIconWithTextModifications()}\n\n    <Button\n      icon={PencilIcon}\n      title=\"Icon action\"\n    />\n\n    {renderIconActionModifications()}\n  </div>\n);\n\nrender(buttons, document.getElementById('buttons'));\n\nconst dark = (\n  <div className=\"buttons dark\">\n    <Button\n      theme={Button.Theme.DARK}\n    >Button default</Button>\n\n\n    <Button\n      theme={Button.Theme.DARK}\n      short\n    >...</Button>\n\n    <Button\n      theme={Button.Theme.DARK}\n      href=\"/\"\n    >Button link</Button>\n\n    <Button\n      theme={Button.Theme.DARK}\n      loader\n    >Dark loader</Button>\n\n    {renderButtonModifications(Button.Theme.DARK)}\n\n    <Button\n      theme={Button.Theme.DARK}\n      text\n    >Text action</Button>\n\n    {renderTextModifications(Button.Theme.DARK)}\n\n    <Button\n      theme={Button.Theme.DARK}\n      icon={PencilIcon}\n    >Icon action</Button>\n\n    {renderIconWithTextModifications(Button.Theme.DARK)}\n\n    <Button\n      icon={PencilIcon}\n      theme={Button.Theme.DARK}\n      title=\"Icon action\"\n    />\n\n    {renderIconActionModifications(Button.Theme.DARK)}\n  </div>\n);\n\nrender(dark, document.getElementById('dark'));\n\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Perform a heavy operation while loading",
      "url": "examples/button/perform-a-heavy-operation-while-loading.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "css",
          "content": "\n#example > :not(:first-child) {\n  margin-left: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, Fragment} from 'react';\nimport {render} from 'react-dom';\nimport Button from '@jetbrains/ring-ui/components/button/button';\nimport Loader from '@jetbrains/ring-ui/components/loader-inline/loader-inline';\nimport {HourglassIcon} from '@jetbrains/ring-ui/components/icon';\n\nclass Sleeper extends Component {\n  state = {\n    loading: false\n  };\n\n  load = () => {\n    this.setState({loading: true}, () => {\n      setTimeout(this.sleep, 2000);\n    })\n  }\n\n  sleep = () => {\n    const date = new Date();\n    let curDate\n    do {\n      curDate = new Date();\n    } while(curDate - date < 2000);\n    this.setState({loading: false});\n  }\n\n  render() {\n    const {loading} = this.state;\n    return (\n      <Fragment>\n        <Button loader={loading} onClick={this.load}>Sleep</Button>\n        <Button loader={loading} icon={HourglassIcon} onClick={this.load} />\n        {loading && <Loader/>}\n      </Fragment>\n    );\n  }\n}\n\nrender(<Sleeper />, document.getElementById('example'));\n\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides styled buttons.",
  "attrs": {
    "name": "Button",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Provides styled buttons.",
    "extends": "{PureComponent}",
    "example-file": "./button.examples.html"
  }
};