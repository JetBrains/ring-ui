window.source = {
  "title": "Tags Input",
  "url": "tags-input.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport getEventKey from '../global/get-event-key';\nimport Select from '../select/select';\nimport TagsList from '../tags-list/tags-list';\nimport Caret from '../caret/caret';\nimport '../input-size/input-size.scss';\nimport memoize from '../global/memoize';\nimport rerenderHOC from '../global/rerender-hoc';\n\nimport styles from './tags-input.css';\n\nfunction noop() {}\n\n/**\n * @name Tags Input\n * @category Components\n * @tags Ring UI Language\n * @constructor\n * @description Displays a tags input field.\n * @extends {ReactComponent}\n * @example-file ./tags-input.examples.html\n */\n\nconst POPUP_VERTICAL_SHIFT = 2;\n\n// eslint-disable-next-line react/no-deprecated\nexport default class TagsInput extends Component {\n  static ngModelStateField = 'tags';\n\n  static propTypes = {\n    className: PropTypes.string,\n    tags: PropTypes.array,\n    /**\n     * Datasource should return array(or promise) of suggestions.\n     * Each suggestion should contain key and label fields.\n     * DataSource should handle caching and response racing (when later request\n     * responded earlier) by himself.\n     */\n    dataSource: PropTypes.func,\n    onAddTag: PropTypes.func,\n    onRemoveTag: PropTypes.func,\n    customTagComponent: (props, propName, componentName) => {\n      if (props[propName] && !props[propName].prototype instanceof Component) {\n        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`);\n      }\n      return null;\n    },\n    maxPopupHeight: PropTypes.number,\n    minPopupWidth: PropTypes.number,\n    placeholder: PropTypes.string,\n    canNotBeEmpty: PropTypes.bool,\n    disabled: PropTypes.bool,\n    autoOpen: PropTypes.bool,\n    renderOptimization: PropTypes.bool,\n    legacyMode: PropTypes.bool,\n\n    loadingMessage: PropTypes.string,\n    notFoundMessage: PropTypes.string\n  };\n\n  static defaultProps = {\n    dataSource: noop,\n    onAddTag: noop,\n    onRemoveTag: noop,\n    customTagComponent: null,\n    maxPopupHeight: 500,\n    minPopupWidth: 360,\n    canNotBeEmpty: false,\n    disabled: false,\n    autoOpen: false,\n    renderOptimization: true,\n    legacyMode: false\n  };\n\n  state = {\n    tags: [],\n    suggestions: [],\n    loading: true,\n    focused: false,\n    query: '',\n    activeIndex: 0\n  };\n\n  componentWillMount() {\n    this.updateStateFromProps(this.props);\n  }\n\n  componentDidMount() {\n    if (this.props.autoOpen && !this.props.disabled) {\n      this.focusInput();\n      this.loadSuggestions();\n      this.select._showPopup();\n    }\n  }\n\n  componentWillReceiveProps(props) {\n    this.updateStateFromProps(props);\n  }\n\n  nodeRef = node => {\n    this.node = node;\n  };\n\n  ngModelStateField = TagsInput.ngModelStateField;\n\n  getInputNode() {\n    if (!this.input) {\n      this.input = this.select.filter;\n      this.caret = new Caret(this.input);\n    }\n    return this.input;\n  }\n\n  setActiveIndex(activeIndex) {\n    this.setState({activeIndex});\n  }\n\n  updateStateFromProps(props) {\n    if (props.tags) {\n      this.setState({tags: props.tags});\n      this.setActiveIndex(props.tags.length);\n    }\n  }\n\n  focusInput = () => {\n    this.getInputNode().focus();\n  };\n\n  addTag = tag => {\n    this.setState(prevState => ({\n      tags: prevState.tags.concat([tag])\n    }));\n    this.select.clear();\n    this.select.filterValue('');\n    this.props.onAddTag({tag});\n    this.setActiveIndex();\n  };\n\n  onRemoveTag(tagToRemove) {\n    return Promise.resolve(this.props.onRemoveTag({tag: tagToRemove})).\n      then(() => {\n        const tags = this.state.tags.filter(tag => tag !== tagToRemove);\n        if (this.node) {\n          this.setState({tags});\n          this.focusInput();\n        }\n        return tags;\n      }, this.focusInput);\n  }\n\n  clickHandler = event => {\n    if (event.target !== this.node) {\n      return;\n    }\n\n    this.loadSuggestions(this.getInputNode().value);\n    this.focusInput();\n  };\n\n  filterExistingTags = suggestions => {\n    const tagsMap = new Map(this.state.tags.map(tag => [tag.key, tag]));\n    return suggestions.filter(suggestion => !tagsMap.has(suggestion.key));\n  };\n\n  loadSuggestions = query => {\n    this.setState({loading: true, query});\n    return Promise.resolve(this.props.dataSource({query})).\n      then(this.filterExistingTags).\n      then(suggestions => {\n        if (this.node && query === this.state.query) {\n          this.setState({suggestions, loading: false});\n        }\n      }).\n      catch(() => this.node && this.setState({loading: false}));\n  };\n\n  _focusHandler = () => {\n    this.setActiveIndex(null);\n    this.setState({focused: true});\n  };\n\n  _blurHandler = () => {\n    this.setState({focused: false});\n  };\n\n  selectTag = moveForward => {\n    const activeIndex = typeof this.state.activeIndex === 'number'\n      ? this.state.activeIndex\n      : this.state.tags.length + 1;\n    let newActiveIndex = activeIndex + (moveForward ? 1 : -1);\n\n    if (newActiveIndex >= this.state.tags.length) {\n      newActiveIndex = this.state.tags.length - 1;\n    } else if (newActiveIndex < 0) {\n      newActiveIndex = 0;\n    }\n\n    if (this.state.activeIndex !== newActiveIndex) {\n      this.setActiveIndex(newActiveIndex);\n    }\n  };\n\n  handleKeyDown = event => {\n    if (this.select._popup.isVisible()) {\n      return true;\n    }\n\n    const key = getEventKey(event);\n    const isInputFocused = () => event.target.matches(this.getInputNode().tagName);\n\n    if (key === 'ArrowLeft') {\n      if (this.getInputNode() && this.caret.getPosition() > 0) {\n        return true;\n      }\n\n      this.selectTag();\n      return false;\n    }\n\n    if (key === 'ArrowRight' && !isInputFocused(event)) {\n      if (this.state.activeIndex === this.state.tags.length - 1) {\n        if (!this.props.disabled) {\n          this.getInputNode().focus();\n          this.setActiveIndex();\n        }\n      } else {\n        this.selectTag(true);\n      }\n      return false;\n    }\n\n    if (!this.props.disabled) {\n      if (key === 'Backspace' && !this.getInputNode().value) {\n        event.preventDefault();\n        const tagsLength = this.state.tags.length;\n        this.select._hidePopup(true); // otherwise confirmation may be overlapped by popup\n        this.onRemoveTag(this.state.tags[tagsLength - 1]);\n        return false;\n      }\n\n      if ((key === 'Delete' || key === 'Backspace') && this.state.tags[this.state.activeIndex]) {\n        this.onRemoveTag(this.state.tags[this.state.activeIndex]).\n          then(() => this.selectTag(true));\n        return false;\n      }\n    }\n\n    return true;\n  };\n\n  handleClick = memoize(tag => () => {\n    this.setActiveIndex(this.state.tags.indexOf(tag));\n  });\n\n  handleRemove = memoize(tag => () => this.onRemoveTag(tag));\n\n  selectRef = el => {\n    this.select = el;\n  };\n\n  render() {\n    const {focused, tags, activeIndex} = this.state;\n    const {legacyMode, disabled, canNotBeEmpty} = this.props;\n    const classes = classNames(\n      styles.tagsInput,\n      {\n        [styles.tagsInputDisabled]: disabled,\n        [styles.tagsInputFocused]: focused,\n        [styles.tagsInputLegacyMode]: legacyMode\n      },\n      this.props.className);\n\n    return (\n      <div\n        className={classes}\n        onKeyDown={this.handleKeyDown}\n        onClick={this.clickHandler}\n        ref={this.nodeRef}\n      >\n        <TagsList\n          tags={tags}\n          activeIndex={activeIndex}\n          disabled={disabled}\n          canNotBeEmpty={canNotBeEmpty}\n          handleRemove={this.handleRemove}\n          className={styles.tagsList}\n          tagClassName={styles.tag}\n          handleClick={this.handleClick}\n        >\n          <Select\n            ref={this.selectRef}\n            type={Select.Type.INPUT_WITHOUT_CONTROLS}\n            label={this.props.placeholder}\n            data={this.state.suggestions}\n            className={classNames('ring-input-size_md', styles.tagsSelect)}\n            onSelect={this.addTag}\n            onFocus={this._focusHandler}\n            onBlur={this._blurHandler}\n            renderOptimization={this.props.renderOptimization}\n            filter={{\n              fn: () => true\n            }}\n            maxHeight={this.props.maxPopupHeight}\n            minWidth={this.props.minPopupWidth}\n            top={POPUP_VERTICAL_SHIFT}\n            loading={this.state.loading}\n            onFilter={this.loadSuggestions}\n            onBeforeOpen={this.loadSuggestions}\n            onKeyDown={this.handleKeyDown}\n            disabled={this.props.disabled}\n\n            loadingMessage={this.props.loadingMessage}\n            notFoundMessage={this.props.notFoundMessage}\n          />\n        </TagsList>\n\n        {!legacyMode && <div className={styles.underline}/>}\n        {!legacyMode && <div className={styles.focusUnderline}/>}\n      </div>);\n  }\n}\n\nexport const RerenderableTagsInput = rerenderHOC(TagsInput, {captureNode: false});\n\n",
  "examples": [
    {
      "name": "Tags Input",
      "url": "examples/tags-input/tags-input.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport TagsInput from '@jetbrains/ring-ui/components/tags-input/tags-input';\n\nfunction dataSource() {\n  return new Promise(resolve => setTimeout(resolve, 200)).\n    then(\n      () => Promise.resolve(\n        [...Array(20)].\n          map((it, index) => ({key: `test${index}`, label: `test${index}`}))\n      )\n    );\n}\n\nrender(<TagsInput\n  className=\"test-additional-class\"\n  tags={[\n    {key: 'test1', label: 'test1'},\n    {key: 'test2', label: 'test2'}\n  ]}\n  maxPopupHeight={250}\n  dataSource={dataSource}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Tags Input with icons",
      "url": "examples/tags-input/tags-input-with-icons.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport TagsInput from '@jetbrains/ring-ui/components/tags-input/tags-input';\nimport {\n  CheckmarkIcon,\n  ExceptionIcon,\n  FrownIcon\n} from '@jetbrains/ring-ui/components/icon';\n\nconst tags = [\n  {key: 'test1', label: 'test1', rgTagIcon: CheckmarkIcon},\n  {key: 'test2', label: 'test2'}\n];\n\nfunction dataSource(query) {\n  return [\n    {key: 'test3', label: 'test3', rgTagIcon: ExceptionIcon, rgTagTitle: 'I am the tag title'},\n    {key: 'test4', label: 'test4', rgTagIcon: FrownIcon}\n  ];\n}\n\nrender(<TagsInput\n  tags={tags}\n  dataSource={dataSource}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Disabled Tags Input",
      "url": "examples/tags-input/disabled-tags-input.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"demo\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React from 'react';\nimport {render} from 'react-dom';\nimport TagsInput from '@jetbrains/ring-ui/components/tags-input/tags-input';\n\nrender(<TagsInput\n  disabled\n  tags={[{key: 'test2', label: 'test2'}]}\n  dataSource={() => []}\n/>, document.getElementById('demo'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a tags input field.",
  "attrs": {
    "name": "Tags Input",
    "category": "Components",
    "tags": "Ring UI Language",
    "constructor": "",
    "description": "Displays a tags input field.",
    "extends": "{ReactComponent}",
    "example-file": "./tags-input.examples.html"
  }
};