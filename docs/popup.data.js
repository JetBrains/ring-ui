window.source = {
  "title": "Popup",
  "url": "popup.html",
  "type": "js",
  "content": "/**\n * @name Popup\n * @category Components\n * @tags Ring UI Language\n * @description Displays a popup.\n */\n\nimport React, {Component} from 'react';\nimport {createPortal} from 'react-dom';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\nimport 'dom4';\nimport 'core-js/modules/es7.array.includes';\n\nimport getUID from '../global/get-uid';\nimport scheduleRAF from '../global/schedule-raf';\nimport {Listeners, getStyles} from '../global/dom';\nimport Shortcuts from '../shortcuts/shortcuts';\nimport dataTests from '../global/data-tests';\n\nimport position, {\n  DEFAULT_DIRECTIONS,\n  Dimension,\n  Directions,\n  Display,\n  MaxHeight,\n  MinWidth,\n  positionPropKeys\n} from './position';\nimport styles from './popup.css';\n\nconst stop = e => e.stopPropagation();\n\n/**\n * @constructor\n * @name Popup\n * @extends {ReactComponent}\n * @example-file ./popup.examples.html\n */\n// eslint-disable-next-line react/no-deprecated\nexport default class Popup extends Component {\n  static PopupProps = {\n    Directions,\n    Dimension,\n    MinWidth,\n    MaxHeight\n  };\n\n  static propTypes = {\n    anchorElement: PropTypes.instanceOf(Node),\n    target: PropTypes.string,\n    className: PropTypes.string,\n    hidden: PropTypes.bool.isRequired,\n    onOutsideClick: PropTypes.func,\n    onEscPress: PropTypes.func,\n    // onCloseAttempt is a common callback for ESC pressing and outside clicking.\n    // Use it if you don't need different behaviors for this cases.\n    onCloseAttempt: PropTypes.func,\n    children: PropTypes.oneOfType([\n      PropTypes.arrayOf(PropTypes.node),\n      PropTypes.node\n    ]),\n    dontCloseOnAnchorClick: PropTypes.bool,\n    shortcuts: PropTypes.bool,\n    keepMounted: PropTypes.bool, // pass this prop to preserve the popup's DOM state while hidden\n    'data-test': PropTypes.string,\n\n    directions: PropTypes.arrayOf(PropTypes.string),\n    autoPositioning: PropTypes.bool,\n    autoCorrectTopOverflow: PropTypes.bool,\n    left: PropTypes.number,\n    top: PropTypes.number,\n    maxHeight: PropTypes.number,\n    minWidth: PropTypes.number,\n    sidePadding: PropTypes.number,\n\n    attached: PropTypes.bool, // Popup adjacent to an input, without upper border and shadow\n\n    onMouseDown: PropTypes.func,\n    onMouseUp: PropTypes.func,\n    onMouseOver: PropTypes.func,\n    onMouseOut: PropTypes.func,\n    onContextMenu: PropTypes.func\n  };\n\n  static contextTypes = {\n    ringPopupTarget: PropTypes.string\n  };\n\n  static childContextTypes = {\n    ringPopupTarget: PropTypes.string\n  };\n\n  static defaultProps = {\n    shortcuts: true,\n    hidden: false,\n    onOutsideClick() {},\n    onEscPress() {},\n    onCloseAttempt() {},\n    dontCloseOnAnchorClick: false,\n    keepMounted: false,\n\n    directions: DEFAULT_DIRECTIONS,\n    autoPositioning: true,\n    autoCorrectTopOverflow: true,\n    left: 0,\n    top: 0,\n    offset: 0,\n    sidePadding: 8,\n\n    attached: false,\n\n    legacy: false\n  };\n\n  state = {\n    shortcuts: this.props.shortcuts && !this.props.hidden,\n    display: Display.SHOWING\n  };\n\n  getChildContext() {\n    return {\n      ringPopupTarget: this.uid\n    };\n  }\n\n  componentDidMount() {\n    // eslint-disable-next-line react/no-did-mount-set-state\n    this.setState({client: true});\n    if (!this.props.hidden) {\n      this._setListenersEnabled(true);\n    }\n  }\n\n  componentWillUpdate(nextProps) {\n    const shortcuts = nextProps.shortcuts && !nextProps.hidden;\n    if (this.state.shortcuts !== shortcuts) {\n      this.setState({shortcuts});\n    }\n  }\n\n  componentDidUpdate(prevProps) {\n    if (this.props !== prevProps) {\n      const {hidden} = this.props;\n\n      if (prevProps.hidden !== hidden) {\n        this._setListenersEnabled(!hidden);\n      }\n\n      this._redraw();\n    }\n  }\n\n  componentWillUnmount() {\n    this._setListenersEnabled(false);\n    this.popup = null;\n  }\n\n  listeners = new Listeners();\n  redrawScheduler = scheduleRAF();\n  uid = getUID('popup-');\n  calculateDisplay = prevState => ({\n    ...prevState,\n    display: this.props.hidden\n      ? Display.SHOWING\n      : Display.SHOWN\n  });\n\n  portalRef = el => {\n    this.node = el;\n    this.parent = el && el.parentElement;\n    if (el && this.getContainer()) {\n      this._redraw();\n    }\n  };\n\n  popupRef = el => {\n    this.popup = el;\n    this._redraw();\n  };\n\n  containerRef = el => {\n    this.container = el;\n  };\n\n  getContainer() {\n    const target = this.props.target || this.context.ringPopupTarget;\n    return target && document.querySelector(`[data-portaltarget=${target}]`);\n  }\n\n  position() {\n    const positionProps = positionPropKeys.reduce((acc, key) => {\n      acc[key] = this.props[key];\n      return acc;\n    }, {});\n    const container = this.getContainer();\n\n    return position({\n      popup: this.popup,\n      container: container && getStyles(container).position !== 'static' ? container : null,\n      anchor: this._getAnchor(),\n      ...positionProps\n    });\n  }\n\n  _updatePosition = () => {\n    if (this.popup) {\n      if (this.isVisible()) {\n        const style = this.position();\n        Object.keys(style).forEach(key => {\n          const value = style[key];\n          if (typeof value === 'number') {\n            this.popup.style[key] = `${value}px`;\n          } else {\n            this.popup.style[key] = value.toString();\n          }\n        });\n      }\n      this.setState(this.calculateDisplay);\n    }\n  };\n\n  _redraw = () => {\n    if (this.isVisible()) {\n      this.redrawScheduler(this._updatePosition);\n    }\n  };\n\n  _getAnchor() {\n    return this.props.anchorElement || this.parent;\n  }\n\n  /**\n   * @param {boolean} enable\n   * @private\n   */\n  _setListenersEnabled(enable) {\n    if (enable && !this._listenersEnabled) {\n      setTimeout(() => {\n        this._listenersEnabled = true;\n        this.listeners.add(window, 'resize', this._redraw);\n        this.listeners.add(window, 'scroll', this._redraw);\n        this.listeners.add(document, 'click', this._onDocumentClick);\n        let el = this._getAnchor();\n        while (el) {\n          this.listeners.add(el, 'scroll', this._redraw);\n          el = el.parentElement;\n        }\n      }, 0);\n\n      return;\n    }\n\n    if (!enable && this._listenersEnabled) {\n      this.listeners.removeAll();\n      this._listenersEnabled = false;\n    }\n  }\n\n  /**\n   * Returns visibility state\n   * @return {boolean}\n   */\n  isVisible() {\n    return !this.props.hidden;\n  }\n\n  _onCloseAttempt(evt, isEsc) {\n    this.props.onCloseAttempt(evt, isEsc);\n  }\n\n  _onEscPress = evt => {\n    this.props.onEscPress(evt);\n    this._onCloseAttempt(evt, true);\n  };\n\n  /**\n   * @param {jQuery.Event} evt\n   * @private\n   */\n  _onDocumentClick = evt => {\n    if (\n      this.container && this.container.contains(evt.target) ||\n      !this._listenersEnabled ||\n      (\n        this.props.dontCloseOnAnchorClick &&\n        this._getAnchor() &&\n        this._getAnchor().contains(evt.target)\n      )\n    ) {\n      return;\n    }\n\n    this.props.onOutsideClick(evt);\n    this._onCloseAttempt(evt, false);\n  };\n\n  getInternalContent() {\n    return this.props.children;\n  }\n\n  shortcutsScope = this.uid;\n  shortcutsMap = {\n    esc: this._onEscPress\n  };\n\n  render() {\n    const {\n      className, hidden, attached, keepMounted,\n      onMouseDown, onMouseUp, onMouseOver, onMouseOut, onContextMenu, 'data-test': dataTest\n    } = this.props;\n    const showing = this.state.display === Display.SHOWING;\n\n    const classes = classNames(className, styles.popup, {\n      [styles.attached]: attached,\n      [styles.hidden]: hidden,\n      [styles.showing]: showing\n    });\n\n    return (\n      <span\n        // prevent bubbling through portal\n        onClick={stop}\n        ref={this.portalRef}\n      >\n        {this.state.shortcuts &&\n          (\n            <Shortcuts\n              map={this.shortcutsMap}\n              scope={this.shortcutsScope}\n            />\n          )\n        }\n\n        {this.state.client && (keepMounted || !hidden) && createPortal(\n          <div\n            data-portaltarget={this.uid}\n            ref={this.containerRef}\n            onMouseOver={onMouseOver}\n            onMouseOut={onMouseOut}\n            onContextMenu={onContextMenu}\n          >\n            <div\n              data-test={dataTests('ring-popup', dataTest)}\n              data-test-shown={!hidden && !showing}\n              ref={this.popupRef}\n              className={classes}\n              onMouseDown={onMouseDown}\n              onMouseUp={onMouseUp}\n            >\n              {this.getInternalContent()}\n            </div>\n          </div>,\n          this.getContainer() || document.body\n        )}\n      </span>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Popup",
      "url": "examples/popup/popup.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\nbody {\n  overflow: hidden;\n}\n\n:global(.button) {\n  position: absolute;\n  left: 50px;\n  bottom: 50px;\n}\n\n:global(.anchor) {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n:global(.topLeft) {\n  left: 0;\n  top: 0;\n  background-color: red;\n}\n\n:global(.topRight) {\n  right: 0;\n  top: 0;\n  background-color: blue;\n}\n\n:global(.bottomLeft) {\n  left: 0;\n  bottom: 0;\n  background-color: green;\n}\n\n:global(.bottomRight) {\n  right: 0;\n  bottom: 0;\n  background-color: orange;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\nimport classNames from 'classnames';\n\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst {Directions} = Popup.PopupProps;\n\nconst directionMap = {\n  topLeft: Directions.BOTTOM_RIGHT,\n  topRight: Directions.BOTTOM_LEFT,\n  bottomLeft: Directions.TOP_RIGHT,\n  bottomRight: Directions.TOP_LEFT\n}\n\nconst directionKeys = Object.keys(directionMap);\nconst initialState = directionKeys.reduce((acc, key) => {\n  acc[key] = true;\n  return acc;\n}, {});\n\nclass PopupExample extends Component {\n  state = initialState;\n\n  renderPopup = key => (\n    <div className={classNames(\"anchor\", key)} key={key}>\n      <Popup\n        hidden={!this.state[key]}\n        onCloseAttempt={() => this.setState({[key]: false})}\n        directions={[directionMap[key]]}\n      >\n        <span>Hello, world!</span>\n      </Popup>\n    </div>\n  );\n\n  showAgain = () => setTimeout(() => {\n    this.setState({bottomLeft: true});\n  });\n\n  render() {\n    return (\n      <div>\n        {directionKeys.map(this.renderPopup)}\n        <button\n          className=\"button\"\n          onClick={this.showAgain}\n        >Show again</button>\n      </div>\n    );\n  }\n}\n\nrender(<PopupExample />, document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Auto-positioning a popup",
      "url": "examples/popup/auto-positioning-a-popup.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\n:global(.message) {\n  position: absolute;\n\n  top: 50%;\n  left: 300px;\n}\n\n:global(.vert) {\n  top: 20%;\n  width: 150px;\n}\n\n:global(.anchor) {\n  position: absolute;\n}\n\n:global(.left) {\n  left: 0;\n  top: 50px;\n}\n\n:global(.right) {\n  right: 0;\n  top: 50px;\n}\n\n:global(.bottom) {\n  left: 150px;\n  bottom: 0;\n}\n\n:global(.top) {\n  right: 150px;\n  top: 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst Directions = Popup.PopupProps.Directions;\n\nconst content = <span className=\"popup\">This is a popup</span>;\nconst example = (\n  <div>\n    <div className=\"message\">Popup should\n      change open direction when reaching window borders\n      <Popup\n        directions={[Directions.TOP_CENTER]}\n      >{content}</Popup>\n    </div>\n    <div className=\"message vert\">Popup should\n      change open direction when reaching window borders\n      <Popup\n        directions={[Directions.RIGHT_CENTER]}\n      >{content}</Popup>\n    </div>\n    <div className=\"anchor left\">Left side open\n      popup\n      <Popup\n        directions={[Directions.LEFT_BOTTOM, Directions.RIGHT_BOTTOM]}\n      >{content}</Popup>\n    </div>\n    <div className=\"anchor right\">Right side\n      open popup\n      <Popup\n        directions={[Directions.RIGHT_BOTTOM, Directions.LEFT_BOTTOM]}\n      >{content}</Popup>\n    </div>\n    <div className=\"anchor bottom\">Downside open\n      popup\n      <Popup\n        directions={[Directions.BOTTOM_RIGHT, Directions.TOP_LEFT]}\n      >{content}</Popup>\n    </div>\n    <div className=\"anchor top\">\n      Upside open popup\n      <Popup\n        directions={[Directions.TOP_LEFT, Directions.BOTTOM_RIGHT]}\n      >{content}</Popup>\n    </div>\n  </div>\n);\n\nrender(example, document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Popup in a popup",
      "url": "examples/popup/popup-in-a-popup.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\n:global(.parent-popup) {\n  width: 100px;\n  height: 100px;\n  text-align: center;\n}\n\n:global(.child-popup) {\n  background-color: red;\n  text-align: center;\n  margin: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component} from 'react';\nimport {render} from 'react-dom';\n\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nclass PopupBox extends Component {\n  state = {hidden: false};\n\n  render() {\n    return (\n      <Popup\n        {...this.state}\n        onCloseAttempt={() => this.setState({hidden: true})}\n      >{this.props.children}</Popup>\n    );\n  }\n}\n\nconst example = (\n  <div>\n    Parent popup anchor\n    <PopupBox>\n      <div className=\"parent-popup\">\n        This is a parent popup\n        <PopupBox>\n          <div className=\"child-popup\">\n            This is a child popup\n          </div>\n        </PopupBox>\n      </div>\n    </PopupBox>\n  </div>\n);\n\nrender(example, document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Popup inside a scrollable container",
      "url": "examples/popup/popup-inside-a-scrollable-container.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n}\n\n:global(.container) {\n  height: 100vh;\n  overflow: auto;\n}\n\n:global(.example) {\n  height: 200vh;\n  display: inline-block;\n}\n\n.anchor{\n  display: inline-block;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst example = (\n  <div className=\"container\">\n    <div className=\"example\">\n      <div className=\"anchor\">\n        Popup anchor\n        <Popup>Popup content</Popup>\n      </div>\n    </div>\n  </div>\n);\n\nrender(example, document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Popup fits screen",
      "url": "examples/popup/popup-fits-screen.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n}\n\n:global(html),\n:global(body) {\n  height: 100%;\n}\n:global(.popupContent) {\n  height: 1300px;\n  padding: 8px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n:global(.anchorBottom) {\n  position: absolute;\n  bottom: 20px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div id=\"example\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\n\nimport Popup from '@jetbrains/ring-ui/components/popup/popup';\n\nconst example = (\n  <div className=\"anchorBottom\">\n    Popup anchor on bottom\n    <Popup maxHeight={1380}>\n      <div className=\"popupContent\">\n        <div>Popup top</div>\n        <div>popup bottom</div>\n      </div>\n    </Popup>\n  </div>\n);\n\nrender(example, document.getElementById('example'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a popup.",
  "attrs": {
    "name": "Popup",
    "category": "Components",
    "tags": "Ring UI Language",
    "description": "Displays a popup."
  }
};