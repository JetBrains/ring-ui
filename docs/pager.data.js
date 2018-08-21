window.source = {
  "title": "Pager",
  "url": "pager.html",
  "type": "js",
  "content": "/**\n * @name Pager\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @extends {ReactComponent}\n * @description The pager.\n * @example-file ./pager.examples.html\n */\n\n/* eslint-disable react/jsx-no-literals */\n/* eslint-disable no-magic-numbers */\n\nimport React, {PureComponent} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport Button from '../button/button';\nimport ButtonGroup from '../button-group/button-group';\nimport ButtonToolbar from '../button-toolbar/button-toolbar';\nimport Select from '../select/select';\nimport memoize from '../global/memoize';\nimport Link from '../link/link';\n\nimport {ChevronLeftIcon, ChevronRightIcon} from '../icon';\n\nimport style from './pager.css';\n\nexport default class Pager extends PureComponent {\n  static propTypes = {\n    total: PropTypes.number.isRequired,\n    currentPage: PropTypes.number,\n    pageSize: PropTypes.number,\n    pageSizes: PropTypes.arrayOf(PropTypes.number),\n    visiblePagesLimit: PropTypes.number,\n    disablePageSizeSelector: PropTypes.bool,\n    openTotal: PropTypes.bool,\n    onPageChange: PropTypes.func,\n    onPageSizeChange: PropTypes.func,\n    onLoadPage: PropTypes.func,\n    className: PropTypes.string,\n    translations: PropTypes.object,\n    hrefFunc: PropTypes.func //function which generates href for all pager's buttons based on pager state passed as a function parameter, either this function or onPageChange should be provided\n  };\n\n  static defaultProps = {\n    currentPage: 1,\n    pageSize: 50,\n    pageSizes: [20, 50, 100],\n    visiblePagesLimit: 7,\n    disablePageSizeSelector: false,\n    openTotal: false,\n    translations: {\n      perPage: 'per page',\n      firstPage: 'First page',\n      lastPage: 'Last page',\n      nextPage: 'Next page',\n      previousPage: 'Previous'\n    },\n    onPageSizeChange: () => {},\n    onLoadPage: () => {}\n  };\n\n  getSelectOptions() {\n    const {pageSize, pageSizes} = this.props;\n    const data = pageSizes.map(size => ({\n      key: size,\n      label: `${size} ${this.props.translations.perPage}`\n    }));\n    const selected = data.find(it => it.key === pageSize);\n    return {selected, data};\n  }\n\n  getTotal() {\n    const {total, pageSize} = this.props;\n    return Math.ceil(total / pageSize);\n  }\n\n  handlePageSizeChange = item => {\n    this.props.onPageSizeChange(item.key);\n  };\n\n  handlePrevClick = () => {\n    const {currentPage} = this.props;\n    if (currentPage !== 1) {\n      const prevPage = currentPage - 1;\n      this.props.onPageChange(prevPage);\n    }\n  };\n\n  handleNextClick = () => {\n    const {currentPage, onLoadPage} = this.props;\n    const nextPage = currentPage + 1;\n    const total = this.getTotal();\n    if (currentPage !== total) {\n      this.props.onPageChange(nextPage);\n    } else if (this.props.openTotal) {\n      onLoadPage(nextPage);\n    }\n  };\n\n  handlePageChange = memoize(i => event => {\n    this.props.onPageChange(i, event);\n  });\n\n  handleLoadMore = memoize(i => () => {\n    this.props.onLoadPage(i);\n  });\n\n  getButton(page, content, key, active) {\n    return (\n      <Button\n        href={this.generateHref(page)}\n        key={key}\n        active={active}\n        {...this.getClickProps(this.handlePageChange(page))}\n      >\n        {content}\n      </Button>\n    );\n  }\n\n  getClickProps(onClick) {\n    const {hrefFunc, onPageChange} = this.props;\n\n    if (!onPageChange) {\n      return {};\n    } else if (hrefFunc) {\n      return {onPlainLeftClick: onClick};\n    } else {\n      return {onClick};\n    }\n  }\n\n  getPageSizeSelector() {\n\n    const selectOptions = this.getSelectOptions();\n\n    return !this.props.disablePageSizeSelector &&\n      (\n        <div data-test=\"ring-pager-page-size-selector\" style={{float: 'right'}}>\n          <Select\n            data={selectOptions.data}\n            selected={selectOptions.selected}\n            onSelect={this.handlePageSizeChange}\n            type={Select.Type.INLINE}\n          />\n        </div>\n      );\n  }\n\n  getPagerLinks() {\n\n    const prevLinkAvailable = this.props.currentPage !== 1;\n\n    const nextLinkAvailable = this.props.openTotal || this.props.currentPage !== this.getTotal();\n\n    const nextIcon = (\n      <ChevronRightIcon key=\"icon\" className={style.chevron} size={ChevronRightIcon.Size.Size16}/>\n    );\n\n    const prevIcon = (\n      <ChevronLeftIcon key=\"icon\" className={style.chevron} size={ChevronLeftIcon.Size.Size16}/>\n    );\n\n    const prevText = this.props.translations.previousPage;\n\n    const nextText = this.props.translations.nextPage;\n\n    const nextLinkContent = WrapText => [\n      <span key=\"text\"><WrapText>{nextText}</WrapText></span>,\n      nextIcon\n    ];\n\n    const prevLinkContent = WrapText => [\n      prevIcon,\n      <span key=\"text\"><WrapText>{prevText}</WrapText></span>\n    ];\n\n    const prevLinkHref = this.generateHref(this.props.currentPage - 1);\n\n    const nextLinkHref = this.generateHref(this.props.currentPage + 1);\n\n    const disabledLinkClasses = classNames({\n      [style.link]: true,\n      [style.linkDisabled]: true\n    });\n\n    return (\n      <div className={style.links}>\n        {prevLinkAvailable\n          ? (\n            <Link\n              href={prevLinkHref}\n              className={style.link}\n              {...this.getClickProps(this.handlePrevClick)}\n            >{prevLinkContent}</Link>\n          )\n          : (\n            <span className={disabledLinkClasses}>\n              {prevIcon}<span key=\"text\">{prevText}</span>\n            </span>\n          )\n        }\n\n        {nextLinkAvailable\n          ? (\n            <Link\n              href={nextLinkHref}\n              className={style.link}\n              {...this.getClickProps(this.handleNextClick)}\n            >{nextLinkContent}</Link>\n          )\n          : (\n            <span className={disabledLinkClasses}>\n              <span key=\"text\">{nextText}</span>{nextIcon}\n            </span>\n          )\n        }\n      </div>\n    );\n  }\n\n  generateHref(page) {\n    if (this.props.hrefFunc === undefined) {\n      return undefined;\n    }\n    const pageSize = this.props.disablePageSizeSelector ? undefined : this.props.pageSize;\n    return this.props.hrefFunc(page, pageSize);\n  }\n\n  getPagerContent() {\n    const {currentPage, visiblePagesLimit} = this.props;\n    const totalPages = this.getTotal();\n\n    if (totalPages < 2 && !this.props.openTotal) {\n      return null;\n    }\n\n    let start = 1;\n    let end = totalPages;\n\n    if (totalPages >= visiblePagesLimit + 6) {\n      const leftHalfFrameSize = Math.ceil(visiblePagesLimit / 2) - 1;\n      const rightHalfFrameSize = visiblePagesLimit - leftHalfFrameSize - 1;\n\n      start = currentPage - leftHalfFrameSize;\n      end = currentPage + rightHalfFrameSize;\n\n      if (start < 1) {\n        const tail = 1 - start;\n        start += tail;\n        end += tail;\n      }\n\n      if (end > totalPages) {\n        const tail = end - totalPages;\n        start -= tail;\n        end -= tail;\n      }\n\n      if (start < 1) {\n        start += 1 - start;\n      }\n    }\n\n    const buttons = [];\n    for (let i = start; i <= end; i++) {\n      buttons.push(this.getButton(i, i, i, i === currentPage));\n    }\n\n    const lastPageButtonAvailable = end < totalPages && !this.props.openTotal;\n\n    return (\n      <div>\n        {this.getPagerLinks()}\n\n        <ButtonToolbar>\n          {start > 1 &&\n        (\n          <ButtonGroup>\n            {this.getButton(1, this.props.translations.firstPage)}\n          </ButtonGroup>\n        )\n          }\n\n          <ButtonGroup>\n            {start > 1 && this.getButton(start - 1, '...')}\n\n            {buttons}\n\n            {end < totalPages && this.getButton(end + 1, '...')}\n\n            {end === totalPages && this.props.openTotal &&\n          (\n            <Button\n              href={this.generateHref(end + 1)}\n              onClick={this.handleLoadMore(end + 1)}\n            >...</Button>\n          )}\n          </ButtonGroup>\n\n          {lastPageButtonAvailable &&\n        (\n          <ButtonGroup>\n            {this.getButton(totalPages, this.props.translations.lastPage)}\n          </ButtonGroup>\n        )\n          }\n        </ButtonToolbar>\n\n        {this.getPageSizeSelector()}\n\n      </div>\n    );\n  }\n\n  render() {\n\n    const classes = classNames(style.pager, this.props.className);\n\n    return (\n      <div data-test=\"ring-pager\" className={classes}>\n        {this.props.total > 1\n          ? this.getPagerContent()\n          : this.getPageSizeSelector()\n        }\n      </div>\n    );\n  }\n}\n",
  "examples": [
    {
      "name": "Pager",
      "url": "examples/pager/pager.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nclass Example extends Component {\n  state = {\n    total: 750,\n    currentPage: 1\n  }\n\n  render() {\n    const {total, currentPage} = this.state;\n    return (\n      <Pager\n        total={total}\n        currentPage={currentPage}\n        disablePageSizeSelector\n        onPageChange={currentPage => this.setState({currentPage})}\n      />\n    );\n  }\n}\n\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with a custom frame size",
      "url": "examples/pager/pager-with-a-custom-frame-size.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nclass Example extends Component {\n  state = {\n    total: 750,\n    currentPage: 1\n  }\n\n  render() {\n    const {total, currentPage} = this.state;\n    return (\n      <Pager\n        total={total}\n        currentPage={currentPage}\n        visiblePagesLimit={3}\n        disablePageSizeSelector\n        onPageChange={currentPage => this.setState({currentPage})}\n      />\n    );\n  }\n}\n\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with a custom frame size #2",
      "url": "examples/pager/pager-with-a-custom-frame-size-2.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nclass Example extends Component {\n  state = {\n    total: 250,\n    currentPage: 1\n  }\n\n  render() {\n    const {total, currentPage} = this.state;\n    return (\n      <Pager\n        total={total}\n        currentPage={currentPage}\n        visiblePagesLimit={5}\n        disablePageSizeSelector\n        onPageChange={currentPage => this.setState({currentPage})}\n      />\n    );\n  }\n}\n\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with a custom frame size #3",
      "url": "examples/pager/pager-with-a-custom-frame-size-3.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nclass Example extends Component {\n  state = {\n    total: 400,\n    currentPage: 1\n  }\n\n  render() {\n    const {total, currentPage} = this.state;\n    return (\n      <Pager\n        total={total}\n        currentPage={currentPage}\n        visiblePagesLimit={5}\n        disablePageSizeSelector\n        onPageChange={currentPage => this.setState({currentPage})}\n      />\n    );\n  }\n}\n\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with a page size selector",
      "url": "examples/pager/pager-with-a-page-size-selector.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nclass Example extends Component {\n  state = {\n    total: 300,\n    currentPage: 1,\n    pageSize: 50\n  }\n\n  render() {\n    const {total, currentPage, pageSize} = this.state;\n    return (\n      <Pager\n        total={total}\n        currentPage={currentPage}\n        pageSize={pageSize}\n        onPageChange={currentPage => this.setState({currentPage})}\n        onPageSizeChange={pageSize => this.setState({pageSize})}\n      />\n    );\n  }\n}\n\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with open total",
      "url": "examples/pager/pager-with-open-total.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nclass Example extends Component {\n  state = {\n    total: 10,\n    currentPage: 1,\n    pageSize: 10\n  }\n\n  render() {\n    const {total, currentPage, pageSize} = this.state;\n    return (\n    <Pager\n      total={total}\n      currentPage={currentPage}\n      pageSize={pageSize}\n      openTotal={total < 100}\n      onPageChange={cp => this.setState({currentPage: cp})}\n      onLoadPage={cp => this.setState({currentPage: cp, total: this.state.total + 10})}\n      visiblePagesLimit={5}\n      disablePageSizeSelector\n    />\n    );\n  }\n}\n\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with open total and history support",
      "url": "examples/pager/pager-with-open-total-and-history-support.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nconst getDataFromUrl = (name, defaultValue) => {\n  const params = new URLSearchParams(location.search);\n  const value = params.get(name);\n  return value != undefined ? parseInt(value) : defaultValue;\n}\n\nconst hrefGenerator = (linkPageNumber, pageSize) => {\n  const params = new URLSearchParams(location.search);\n  params.set('page', linkPageNumber)\n  if (pageSize != undefined){\n     params.set('pageSize', pageSize)\n  }\n  return `${location.pathname}?${params}`;\n}\n\nconst handleHistory = (page, pageSize) => {\n  window.history.pushState({page: page, pageSize: pageSize}, '', hrefGenerator(page, pageSize));\n};\n\nclass Example extends Component {\n  state = {\n      total: 999,\n      currentPage: getDataFromUrl(\"page\", 1),\n      pageSize: getDataFromUrl(\"pageSize\", 20)\n  }\n\n  handlePageChange(update) {\n      this.setState(update, () => history.pushState(this.state, '',\n                      hrefGenerator(this.state.currentPage, this.state.pageSize)))\n  }\n\n  componentDidMount() {\n    history.replaceState(this.state, '', hrefGenerator(this.state.currentPage, this.state.pageSize))\n    window.addEventListener('popstate', event => {\n      if (window.history.state && window.history.state.currentPage && window.history.state.pageSize){\n          this.setState({pageSize: window.history.state.pageSize, currentPage: window.history.state.currentPage});\n      }\n    }, false);\n  }\n\n  componentWillUnmount() {\n    window.removeEventListener('popstate');\n  }\n\n\n  render() {\n    const {total, currentPage, pageSize} = this.state;\n    return (\n      <Pager\n        total={total}\n        currentPage={currentPage}\n        pageSize={pageSize}\n        hrefFunc={hrefGenerator}\n        visiblePagesLimit={5}\n        openTotal={total < 2000}\n        onPageChange={currentPage => this.handlePageChange({currentPage})}\n        onPageSizeChange={pageSize => this.handlePageChange({currentPage: 1, pageSize})}\n        onLoadPage={currentPage => this.handlePageChange(prevState => ({currentPage, total: prevState.total + 500}))}\n      />\n    );\n  }\n}\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Pager with reload on current page change",
      "url": "examples/pager/pager-with-reload-on-current-page-change.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"pager\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport React, {Component, createElement} from 'react';\nimport {render} from 'react-dom';\nimport Pager from '@jetbrains/ring-ui/components/pager/pager';\n\nconst getDataFromUrl = (name, defaultValue) => {\n  const params = new URLSearchParams(location.search);\n  const value = params.get(name);\n  return value != undefined ? parseInt(value) : defaultValue;\n}\n\nconst hrefGenerator = (linkPageNumber, pageSize) => {\n  const params = new URLSearchParams(location.search);\n  params.set('page', linkPageNumber)\n  if (pageSize != undefined){\n    params.set('pageSize', pageSize)\n  }\n  return `${location.pathname}?${params}`;\n}\n\nclass Example extends Component {\n  state = {\n  total: 120,\n  currentPage: getDataFromUrl(\"page\", 1),\n  pageSize: getDataFromUrl(\"pageSize\", 20)\n}\n\nrender() {\n  const {total, currentPage, pageSize} = this.state;\n  return (\n    <Pager\n      total={total}\n      currentPage={currentPage}\n      pageSize={pageSize}\n      hrefFunc={hrefGenerator}\n      visiblePagesLimit={5}\n    />\n    );\n  }\n}\nrender(createElement(Example, {}), document.getElementById('pager'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "The pager.",
  "attrs": {
    "name": "Pager",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "extends": "{ReactComponent}",
    "description": "The pager.",
    "example-file": "./pager.examples.html"
  }
};