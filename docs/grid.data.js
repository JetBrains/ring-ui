window.source = {
  "title": "Grid",
  "url": "grid.html",
  "type": "js",
  "content": "import React, {Component} from 'react';\nimport PropTypes from 'prop-types';\nimport classNames from 'classnames';\n\nimport styles from './grid.css';\n\n/**\n * @name Grid\n * @category Components\n * @tags Ring UI Language\n * @framework React\n * @constructor\n * @description Implements a flexbox-like grid system for components placement.\n * Inspired by React-flexbox-grid component.\n * See http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information.\n * @example-file ./grid.examples.html\n */\n\nexport class Grid extends Component {\n  static propTypes = {\n    className: PropTypes.string,\n    children: PropTypes.node\n  };\n\n  render() {\n    const {children, className, ...restProps} = this.props;\n    const classes = classNames(styles['container-fluid'], className);\n\n    return (\n      <div\n        {...restProps}\n        className={classes}\n      >\n        {children}\n      </div>\n    );\n  }\n}\n\nexport {default as Row} from './row';\nexport {default as Col} from './col';\n",
  "examples": [
    {
      "name": "Responsive grid",
      "url": "examples/grid/responsive-grid.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"grid\"></div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.cell) {\n  background-color: silver;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport {Grid, Row, Col} from '@jetbrains/ring-ui/components/grid/grid';\n\nclass GridDemo extends React.Component {\n  render() {\n    return (\n      <Grid>\n        <Row start=\"xs\">\n          <Col xs={12} sm={4} md={6} lg={3}>\n            <div className=\"cell\">Cell 1</div>\n          </Col>\n          <Col xs={12} sm={8} md={6} lg={3}>\n            <div className=\"cell\">Cell 2</div>\n          </Col>\n          <Col xs={12} smOffset={4} sm={8} md={12} lg={6}>\n            <div className=\"cell\">Cell 3</div>\n          </Col>\n        </Row>\n      </Grid>\n    );\n  }\n}\n\nrender(<GridDemo />, document.getElementById('grid'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Grid offset",
      "url": "examples/grid/grid-offset.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"grid\"></div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.cell) {\n  background-color: silver;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport {Grid, Row, Col} from '@jetbrains/ring-ui/components/grid/grid';\n\nclass GridDemo extends React.Component {\n  render() {\n    return (\n      <div>\n        <h4>Offset a column.</h4>\n        <Grid data-test=\"offset\">\n          <Row>\n            <Col xsOffset={11} xs={1}>\n              <div className=\"cell\">xsOffset={11} xs={1}</div>\n            </Col>\n            <Col xsOffset={10} xs={2}>\n              <div className=\"cell\">xsOffset={10} xs={2}</div>\n            </Col>\n            <Col xsOffset={9} xs={3}>\n              <div className=\"cell\">xsOffset={9} xs={3}</div>\n            </Col>\n            <Col xsOffset={8} xs={4}>\n              <div className=\"cell\">xsOffset={8} xs={4}</div>\n            </Col>\n            <Col xsOffset={7} xs={5}>\n              <div className=\"cell\">xsOffset={7} xs={5}</div>\n            </Col>\n            <Col xsOffset={6} xs={6}>\n              <div className=\"cell\">xsOffset={6} xs={6}</div>\n            </Col>\n            <Col xsOffset={5} xs={7}>\n              <div className=\"cell\">xsOffset={5} xs={7}</div>\n            </Col>\n            <Col xsOffset={4} xs={8}>\n              <div className=\"cell\">xsOffset={4} xs={8}</div>\n            </Col>\n            <Col xsOffset={3} xs={9}>\n              <div className=\"cell\">xsOffset={3} xs={9}</div>\n            </Col>\n            <Col xsOffset={2} xs={10}>\n              <div className=\"cell\">xsOffset={2} xs={10}</div>\n            </Col>\n            <Col xsOffset={1} xs={11}>\n              <div className=\"cell\">xsOffset={1} xs={11}</div>\n            </Col>\n          </Row>\n        </Grid>\n      </div>\n    );\n  }\n}\n\nrender(<GridDemo />, document.getElementById('grid'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Grid auto size",
      "url": "examples/grid/grid-auto-size.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"grid\"></div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.cell) {\n  background-color: silver;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport {Grid, Row, Col} from '@jetbrains/ring-ui/components/grid/grid';\n\nclass GridDemo extends React.Component {\n  render() {\n    return (\n      <div>\n        <h4>Auto Width: add any number of auto sizing columns to a row. Let the grid figure it out.</h4>\n        <Grid data-test=\"auto-size\">\n          <Row>\n            <Col xs>\n            <div className=\"cell\">Autosize</div>\n            </Col>\n            <Col xs>\n            <div className=\"cell\">Autosize column with larger text</div>\n            </Col>\n          </Row>\n          <Row>\n            <Col xs>\n            <div className=\"cell\">Autosize</div>\n            </Col>\n            <Col xs>\n            <div className=\"cell\">Autosize column with much much much larger text</div>\n            </Col>\n            <Col xs>\n            <div className=\"cell\">Autosize</div>\n            </Col>\n          </Row>\n        </Grid>\n      </div>\n    );\n  }\n}\n\nrender(<GridDemo />, document.getElementById('grid'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Grid alignment",
      "url": "examples/grid/grid-alignment.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"grid\"></div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.cell) {\n  background-color: silver;\n}\n:global(.cell_tall) {\n  height: 64px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport {Grid, Row, Col} from '@jetbrains/ring-ui/components/grid/grid';\n\nclass GridDemo extends React.Component {\n  render() {\n    return (\n      <div>\n        <h4>\n          Add classes to align elements to the start or end of row as well as the top, bottom, or center of a column\n        </h4>\n        <Grid data-test=\"alignment\">\n          <Row>\n            <Col xs={12}>\n              <Row start=\"xs\">\n                <Col xs={6} className=\"cell\">start</Col>\n              </Row>\n            </Col>\n          </Row>\n          <Row>\n            <Col xs={12}>\n              <Row center=\"xs\">\n                <Col xs={6} className=\"cell\">center</Col>\n              </Row>\n            </Col>\n          </Row>\n          <Row>\n            <Col xs={12}>\n              <Row end=\"xs\">\n                <Col xs={6} className=\"cell\">end</Col>\n              </Row>\n            </Col>\n          </Row>\n          <Row>\n              <Col xs={12}>\n                <Row top=\"xs\">\n                  <Col xs={6}><div className=\"cell\">top</div></Col>\n                  <Col xs={6}><div className=\"cell cell_tall\"></div></Col>\n                </Row>\n              </Col>\n            </Row>\n            <Row>\n              <Col xs={12}>\n                <Row middle=\"xs\">\n                  <Col xs={6}><div className=\"cell\">middle</div></Col>\n                  <Col xs={6}><div className=\"cell cell_tall\"></div></Col>\n                </Row>\n              </Col>\n            </Row>\n            <Row>\n              <Col xs={12}>\n                <Row bottom=\"xs\">\n                  <Col xs={6}><div className=\"cell\">bottom</div></Col>\n                  <Col xs={6}><div className=\"cell cell_tall\"></div></Col>\n                </Row>\n              </Col>\n            </Row>\n        </Grid>\n      </div>\n    );\n  }\n}\n\nrender(<GridDemo />, document.getElementById('grid'));\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Grid columns distribution",
      "url": "examples/grid/grid-columns-distribution.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"grid\"></div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.cell) {\n  background-color: silver;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {render} from 'react-dom';\nimport React from 'react';\nimport {Grid, Row, Col} from '@jetbrains/ring-ui/components/grid/grid';\n\nclass GridDemo extends React.Component {\n  render() {\n    return (\n      <div>\n        <h4>Distribution: add classes to distribute the contents of a row or column.</h4>\n        <Grid data-test=\"distribution\">\n          <Row around=\"xs\">\n            <Col xs={2}><div className=\"cell\">around</div></Col>\n            <Col xs={2}><div className=\"cell\">around</div></Col>\n            <Col xs={2}><div className=\"cell\">around</div></Col>\n          </Row>\n          <Row between=\"xs\">\n            <Col xs={2}><div className=\"cell\">between</div></Col>\n            <Col xs={2}><div className=\"cell\">between</div></Col>\n            <Col xs={2}><div className=\"cell\">between</div></Col>\n          </Row>\n        </Grid>\n      </div>\n    );\n  }\n}\n\nrender(<GridDemo />, document.getElementById('grid'));\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Implements a flexbox-like grid system for components placement.\nInspired by React-flexbox-grid component.\nSee http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information.",
  "attrs": {
    "name": "Grid",
    "category": "Components",
    "tags": "Ring UI Language",
    "framework": "React",
    "constructor": "",
    "description": "Implements a flexbox-like grid system for components placement.\nInspired by React-flexbox-grid component.\nSee http://roylee0704.github.io/react-flexbox-grid/ and http://flexboxgrid.com/ for additional information.",
    "example-file": "./grid.examples.html"
  }
};