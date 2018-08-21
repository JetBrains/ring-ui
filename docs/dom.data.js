window.source = {
  "title": "DOM",
  "url": "dom.html",
  "type": "js",
  "content": "/**\n * @name DOM\n * @category Utilities\n * @tags Ring UI Language\n * @description A collection of DOM utilities.\n * @example\n   <example name=\"DOM\">\n    <file name=\"index.html\">\n      <div>\n        <div id=\"rect-target\" style=\"min-width: 200px\"></div>\n\n        <div id=\"report\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import {getStyles, getRect, getPixelRatio, getWindowHeight} from '@jetbrains/ring-ui/components/global/dom';\n\n      const rectTarget = document.getElementById('rect-target');\n      rectTarget.innerHTML = `\n        Element min-width = ${getStyles(rectTarget).minWidth} <br/>\n        Element rect = ${JSON.stringify(getRect(rectTarget))} <br/>\n      `;\n\n      const report = document.getElementById('report');\n      report.innerHTML = `\n       Pixel ratio = ${getPixelRatio()} <br/>\n       Window height = ${getWindowHeight()} <br/>\n      `;\n    </file>\n   </example>\n */\n\nexport const getStyles = window.getComputedStyle.bind(window);\n\nexport function isMounted(node) {\n  if (node === document) {\n    return true;\n  }\n\n  return node instanceof Node && document.documentElement.contains(node.parentNode);\n}\n\nconst rectStub = {top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0};\n\nexport function getRect(node) {\n  if (node instanceof Range || isMounted(node)) {\n    const {top, right, bottom, left, width, height} = node.getBoundingClientRect();\n    return {top, right, bottom, left, width, height};\n  } else {\n    return Object.assign({}, rectStub);\n  }\n}\n\nexport function getPixelRatio() {\n  return 'devicePixelRatio' in window ? window.devicePixelRatio : 1;\n}\n\nexport function getWindowHeight() {\n  return window.innerHeight;\n}\n\nexport function getDocumentScrollTop() {\n  return (document.documentElement && document.documentElement.scrollTop) ||\n    document.body.scrollTop;\n}\n\nexport function getDocumentScrollLeft() {\n  return (document.documentElement && document.documentElement.scrollLeft) ||\n    document.body.scrollLeft;\n}\n\nexport class Listeners {\n  _all = new Set();\n\n  add(el, event, handler, useCapture) {\n    el.addEventListener(event, handler, useCapture);\n    const dispatchFn = () => el.removeEventListener(event, handler, useCapture);\n    this._all.add(dispatchFn);\n    return dispatchFn;\n  }\n\n  remove(fn) {\n    fn();\n    this._all.delete(fn);\n  }\n\n  removeAll() {\n    this._all.forEach(fn => this.remove(fn));\n  }\n}\n\n// Synthetic events from Combokeys#trigger are plain objects\nexport function preventDefault(e) {\n  if (e.preventDefault) {\n    e.preventDefault();\n  }\n}\n",
  "examples": [
    {
      "name": "DOM",
      "url": "examples/dom/dom.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div id=\"rect-target\" style=\"min-width: 200px\"></div>\n\n  <div id=\"report\"></div>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport {getStyles, getRect, getPixelRatio, getWindowHeight} from '@jetbrains/ring-ui/components/global/dom';\n\nconst rectTarget = document.getElementById('rect-target');\nrectTarget.innerHTML = `\n  Element min-width = ${getStyles(rectTarget).minWidth} <br/>\n  Element rect = ${JSON.stringify(getRect(rectTarget))} <br/>\n`;\n\nconst report = document.getElementById('report');\nreport.innerHTML = `\n Pixel ratio = ${getPixelRatio()} <br/>\n Window height = ${getWindowHeight()} <br/>\n`;\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A collection of DOM utilities.",
  "attrs": {
    "name": "DOM",
    "category": "Utilities",
    "tags": "Ring UI Language",
    "description": "A collection of DOM utilities.",
    "example": "   <example name=\"DOM\">\n    <file name=\"index.html\">\n      <div>\n        <div id=\"rect-target\" style=\"min-width: 200px\"></div>\n\n        <div id=\"report\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import {getStyles, getRect, getPixelRatio, getWindowHeight} from '@jetbrains/ring-ui/components/global/dom';\n\n      const rectTarget = document.getElementById('rect-target');\n      rectTarget.innerHTML = `\n        Element min-width = ${getStyles(rectTarget).minWidth} <br/>\n        Element rect = ${JSON.stringify(getRect(rectTarget))} <br/>\n      `;\n\n      const report = document.getElementById('report');\n      report.innerHTML = `\n       Pixel ratio = ${getPixelRatio()} <br/>\n       Window height = ${getWindowHeight()} <br/>\n      `;\n    </file>\n   </example>"
  }
};