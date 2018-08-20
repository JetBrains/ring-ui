window.source = {
  "title": "Date Picker",
  "url": "date-picker.html",
  "type": "js",
  "content": "import React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport rerenderHOC from '../global/rerender-hoc';\n\nimport Popup from '../popup/popup';\nimport Dropdown from '../dropdown/dropdown';\n\nimport DatePopup from './date-popup';\nimport {dateType, parseDate} from './consts';\nimport styles from './date-picker.css';\n\n/**\n * @name Date Picker\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Allows picking a date or a date range. Uses [moment.js](http://momentjs.com/) under the hood. You may want to either [bundle only the needed locales](https://webpack.js.org/plugins/context-replacement-plugin/#newcontentresource-newcontentrecursive-newcontentregexp) or even to [ignore all of them](https://webpack.js.org/plugins/ignore-plugin/#ignore-moment-locales).\n * @example-file ./date-picker.examples.html\n */\n\nexport default class DatePicker extends PureComponent {\n  static propTypes = {\n    className: PropTypes.string,\n    popupClassName: PropTypes.string,\n    date: dateType,\n    range: PropTypes.bool,\n    from: dateType,\n    to: dateType,\n    clear: PropTypes.bool,\n    displayFormat: PropTypes.string,\n    displayMonthFormat: PropTypes.string,\n    displayDayFormat: PropTypes.string,\n    inputFormat: PropTypes.string,\n    datePlaceholder: PropTypes.string,\n    rangePlaceholder: PropTypes.string,\n    onChange: PropTypes.func,\n    dropdownProps: PropTypes.object\n  };\n\n  static defaultProps = {\n    className: '',\n    date: null,\n    range: false,\n    from: null,\n    to: null,\n    clear: false,\n    displayFormat: 'D MMM YYYY',\n    displayMonthFormat: 'D MMM',\n    displayDayFormat: 'D',\n    inputFormat: 'D MMM YYYY',\n    datePlaceholder: 'Set a date',\n    rangePlaceholder: 'Set a period',\n    onChange() {}\n  };\n\n  clear = () => {\n    this.props.onChange(\n      this.props.range\n        ? {from: null, to: null}\n        : null\n    );\n  };\n\n  popupRef = el => {\n    this.popup = el;\n  };\n\n  closePopup = () => {\n    this.popup._onCloseAttempt();\n  };\n\n  render() {\n    const {\n      className,\n      popupClassName,\n      displayMonthFormat,\n      displayDayFormat,\n      datePlaceholder,\n      rangePlaceholder,\n      clear,\n      dropdownProps,\n      ...datePopupProps\n    } = this.props;\n\n    const {\n      range,\n      displayFormat,\n      inputFormat\n    } = datePopupProps;\n\n    const classes = classNames(\n      styles.datePicker,\n      className\n    );\n\n    const parse = text => parseDate(\n      text,\n      inputFormat,\n      displayFormat\n    );\n\n    const date = parse(this.props.date);\n    const from = parse(this.props.from);\n    const to = parse(this.props.to);\n\n    let text;\n    if (!range) {\n      text = date ? date.format(displayFormat) : datePlaceholder;\n    } else if (!from && !to) {\n      text = rangePlaceholder;\n    } else if (!to) {\n      text = `${from.format(displayFormat)} —`;\n    } else if (!from) {\n      text = `— ${to.format(displayFormat)}`;\n    } else if (!from.isSame(to, 'year')) {\n      text = `${from.format(displayFormat)} — ${to.format(displayFormat)}`;\n    } else if (!from.isSame(to, 'month')) {\n      text = `${from.format(displayMonthFormat)} — ${to.format(displayFormat)}`;\n    } else if (!from.isSame(to, 'day')) {\n      text = `${from.format(displayDayFormat)} — ${to.format(displayFormat)}`;\n    } else {\n      text = `${to.format(displayFormat)}`;\n    }\n\n    return (\n      <Dropdown\n        className={classes}\n        anchor={text}\n        {...dropdownProps}\n      >\n        <Popup\n          keepMounted\n          className={popupClassName}\n          ref={this.popupRef}\n          directions={[\n            Popup.PopupProps.Directions.BOTTOM_RIGHT,\n            Popup.PopupProps.Directions.BOTTOM_LEFT,\n            Popup.PopupProps.Directions.TOP_LEFT,\n            Popup.PopupProps.Directions.TOP_RIGHT\n          ]}\n        >\n          <DatePopup\n            onClear={clear ? this.clear : null}\n            {...datePopupProps}\n            onComplete={this.closePopup}\n          />\n        </Popup>\n      </Dropdown>\n    );\n  }\n}\n\nexport const RerenderableDatePicker = rerenderHOC(DatePicker);\n\n",
  "examples": [
    {
      "name": "Date picker (single date)",
      "url": "examples/date-picker/date-picker-single-date.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"date-picker\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport DatePicker from '@jetbrains/ring-ui/components/date-picker/date-picker';\n\nconst container = document.getElementById('date-picker');\n\nclass DatePickerExample extends Component {\n  state = {date: '20.09.14'}\n\n  setDate = date => {\n    this.setState({date})\n  }\n\n  render() {\n    return (\n      <div>\n        <DatePicker\n          date={this.state.date}\n          onChange={this.setDate}\n        />\n      </div>\n    );\n  }\n}\n\nrender(<DatePickerExample />, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Date picker (range)",
      "url": "examples/date-picker/date-picker-range.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"date-picker\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport DatePicker from '@jetbrains/ring-ui/components/date-picker/date-picker';\n\nconst container = document.getElementById('date-picker');\n\nclass DatePickerExample extends Component {\n  state = {\n    from: '20 January 2015',\n    to: '7 February 2015'\n  };\n\n  setRange = ({from, to}) => {\n    this.setState({from, to});\n  }\n\n  render() {\n    return (\n      <div>\n        <DatePicker\n          from={this.state.from}\n          to={this.state.to}\n          onChange={this.setRange}\n          range\n        />\n      </div>\n    );\n  }\n}\n\nrender(<DatePickerExample />, container);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Date picker (clearable)",
      "url": "examples/date-picker/date-picker-clearable.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"date-picker\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React, {Component} from 'react';\n\nimport DatePicker from '@jetbrains/ring-ui/components/date-picker/date-picker';\n\nconst container = document.getElementById('date-picker');\n\nclass DatePickerExample extends Component {\n  state = {date: '20.09.14'}\n  setDate = date => {\n    this.setState({date})\n  }\n\n  render() {\n    return (\n      <div>\n        <DatePicker\n          date={this.state.date}\n          onChange={this.setDate}\n          clear\n        />\n      </div>\n    );\n  }\n}\n\nrender(<DatePickerExample />, container);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Allows picking a date or a date range. Uses [moment.js](http://momentjs.com/) under the hood. You may want to either [bundle only the needed locales](https://webpack.js.org/plugins/context-replacement-plugin/#newcontentresource-newcontentrecursive-newcontentregexp) or even to [ignore all of them](https://webpack.js.org/plugins/ignore-plugin/#ignore-moment-locales).",
  "attrs": {
    "name": "Date Picker",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Allows picking a date or a date range. Uses [moment.js](http://momentjs.com/) under the hood. You may want to either [bundle only the needed locales](https://webpack.js.org/plugins/context-replacement-plugin/#newcontentresource-newcontentrecursive-newcontentregexp) or even to [ignore all of them](https://webpack.js.org/plugins/ignore-plugin/#ignore-moment-locales).",
    "example-file": "./date-picker.examples.html"
  }
};