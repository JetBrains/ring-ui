window.source = {
  "title": "Input",
  "url": "input.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport {CloseIcon} from '../icon';\nimport Theme from '../global/theme';\nimport Button from '../button/button';\n\nimport ieCompatibleInputHOC from './ie-compatible-hoc';\nimport styles from './input.css';\n\nfunction noop() {}\n\n/**\n * @name Input\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Text input fields of varying size.\n * @example-file ./input.examples.html\n */\n\nconst Size = {\n  AUTO: 'Auto',\n  S: 'S',\n  M: 'M',\n  L: 'L',\n  FULL: 'FULL'\n};\n\nexport class Input extends PureComponent {\n  static propTypes = {\n    value: PropTypes.string,\n    theme: PropTypes.string,\n    className: PropTypes.string,\n    inputClassName: PropTypes.string,\n    size: PropTypes.string,\n    label: PropTypes.string,\n    active: PropTypes.bool,\n    error: PropTypes.string,\n    multiline: PropTypes.bool,\n    borderless: PropTypes.bool,\n    onChange: PropTypes.func,\n    onClear: PropTypes.func,\n    inputRef: PropTypes.func,\n    children: PropTypes.string\n  };\n\n  static defaultProps = {\n    theme: Theme.LIGHT,\n    size: Size.M,\n    onChange: noop,\n    inputRef: noop\n  };\n\n  state = {\n    empty: true\n  };\n\n  componentDidMount() {\n    this.adapt();\n  }\n\n  componentDidUpdate() {\n    this.adapt();\n  }\n\n  checkValue() {\n    this.setState({\n      empty: !this.input.value\n    });\n\n    if (this.props.multiline && this.input.scrollHeight > this.input.clientHeight) {\n      this.stretch(this.input);\n    }\n  }\n\n  stretch(el) {\n    if (!el) {\n      return;\n    }\n    el.style.height = `${el.scrollHeight}px`;\n  }\n\n  adapt() {\n    this.checkValue();\n    this.stretch(this.error);\n  }\n\n  errorRef = el => {\n    this.error = el;\n  };\n\n  inputRef = el => {\n    this.input = el;\n    this.props.inputRef(el);\n  };\n\n  clear = e => {\n    this.props.onClear && this.props.onClear(e);\n  };\n\n  handleChange = e => {\n    this.props.onChange(e);\n    this.checkValue(e.target);\n  };\n\n  render() {\n    const {\n      // Modifiers\n      theme,\n      size,\n      active,\n      multiline,\n      borderless,\n\n      // Props\n      label,\n      error,\n      className,\n      inputClassName,\n      children,\n      value,\n      onClear,\n      inputRef, onChange, // eslint-disable-line no-unused-vars\n      ...restProps\n    } = this.props;\n    const {empty} = this.state;\n    const clearable = !!onClear;\n    const classes = classNames(\n      styles.container,\n      className,\n      styles[theme],\n      [styles[`size${size}`]],\n      {\n        [styles.active]: active,\n        [styles.error]: error != null,\n        [styles.empty]: empty,\n        [styles.noLabel]: !this.props.label,\n        [styles.clearable]: clearable,\n        [styles.borderless]: borderless\n      }\n    );\n\n    const inputClasses = classNames(styles.input, inputClassName);\n\n    const TagName = multiline ? 'textarea' : 'input';\n\n    const text = value != null ? value : children;\n\n    return (\n      <div\n        className={classes}\n        data-test=\"ring-input\"\n      >\n        <TagName\n          ref={this.inputRef}\n          onChange={this.handleChange}\n          className={inputClasses}\n          value={text}\n          rows={multiline ? 1 : null}\n          {...restProps}\n        />\n        {clearable && (\n          <Button\n            className={styles.clear}\n            icon={CloseIcon}\n            iconSize={Button.IconSize.Size14}\n            onClick={this.clear}\n          />\n        )}\n\n        {!borderless && <label className={styles.label}>{label}</label>}\n        {!borderless && <div className={styles.underline}/>}\n        {!borderless && <div className={styles.focusUnderline}/>}\n        {!borderless && <div className={styles.errorUnderline}/>}\n        {!borderless && (\n          <div\n            className={styles.errorText}\n            ref={this.errorRef}\n          >{error}</div>\n        )}\n      </div>\n    );\n  }\n}\n\nexport default ieCompatibleInputHOC(Input);\n\nexport {Size, Theme};\n",
  "examples": [
    {
      "name": "input",
      "url": "examples/input/input.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n}\n\n:global(.inputs) {\n  display: flex;\n  flex-flow: column wrap;\n  max-height: 100vh;\n  margin-top: 8px;\n\n  & > div {\n    margin: 0 16px;\n  }\n}\n\ndiv:global(.dark) {\n  background: #000;\n  margin-left: 0;\n  padding-left: 16px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"inputs\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {PureComponent} from 'react';\n\nimport Input, {Size, Theme} from '@jetbrains/ring-ui/components/input/input';\n\nconst container = document.getElementById('inputs');\n\nclass ClearableInput extends PureComponent {\n  state = {\n    text: this.props.defaultValue\n  };\n\n  setText = e => {\n    this.setState({\n      text: e.target.value\n    });\n  };\n\n  clear = () => {\n    this.setState({\n      text: \"\"\n    });\n  };\n\n  render() {\n    const {defaultValue, ...restProps} = this.props; // eslint-disabe unused-vars\n    return (\n      <Input\n        value={this.state.text}\n        onChange={this.setText}\n        onClear={this.clear}\n        {...restProps}\n      />\n    );\n  }\n}\n\nconst inputs = (\n  <form className=\"inputs\">\n    <Input label=\"Labeled input\" />\n    <Input\n      name=\"login\"\n      label=\"Label and hint\"\n      placeholder=\"Hint\"\n    />\n    <Input\n      label=\"Label and value\"\n      defaultValue=\"Default value\"\n    />\n    <ClearableInput\n      label=\"Clearable input\"\n      defaultValue=\"Default value\"\n    />\n    <ClearableInput\n      placeholder=\"Hint\"\n      defaultValue=\"Borderless input\"\n      borderless\n    />\n    <Input\n      label=\"Active input\"\n      active\n      defaultValue=\"Default value\"\n    />\n    <Input\n      label=\"Disabled input\"\n      disabled\n      defaultValue=\"Default value\"\n    />\n    <Input\n      label=\"Invalid input\"\n      error=\"Error description that wraps over lines because of being really long\"\n    />\n    <Input\n      label=\"Error without description\"\n      error=\"\"\n    />\n    <Input\n      label=\"Short input\"\n      size={Size.S}\n    />\n    <Input\n      label=\"Long input\"\n      size={Size.L}\n    />\n    <Input\n      label=\"Autogrowing textarea\"\n      multiline\n    />\n    <div className=\"dark\">\n      <Input\n        label=\"Input on dark background\"\n        placeholder=\"Hint on dark background\"\n        theme={Theme.DARK}\n      />\n    </div>\n  </form>\n)\n\nrender(inputs, container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Text input fields of varying size.",
  "attrs": {
    "name": "Input",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Text input fields of varying size.",
    "example-file": "./input.examples.html"
  }
};