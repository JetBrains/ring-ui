/* eslint-disable quotes */
var tree = {
  "name": "root",
  "attributes": {},
  "children": [{
    "name": "example",
    "attributes": {"name": "Disabled select"},
    "children": [{
      "name": "file",
      "attributes": {"name": "index.html"},
      "children": [{
        "name": "div",
        "attributes": {"id": "demo1"},
        "children": [],
        "content": ""
      }, {
        "name": "div",
        "attributes": {"id": "demo2"},
        "children": [],
        "content": ""
      }],
      "content": ""
    }, {
      "name": "file",
      "attributes": {"name": "index.js", "webpack": "true"},
      "children": [],
      "content": "var React = require('react');\n   var Select = require('./select.jsx');\n\n   React.renderComponent(Select({disabled: true, loading: true}), document.getElementById('demo1'));\n   React.renderComponent(Select({disabled: true, loading: true, type: Select.Type.INPUT}), document.getElementById('demo2'));\n "
    }],
    "content": ""
  }, {
    "name": "example",
    "attributes": {"name": "Simple input select"},
    "children": [{
      "name": "file",
      "attributes": {"name": "index.html"},
      "children": [{
        "name": "div",
        "attributes": {"id": "demo"},
        "children": [],
        "content": ""
      }],
      "content": ""
    }, {
      "name": "file",
      "attributes": {"name": "index.js", "webpack": "true"},
      "children": [],
      "content": "var React = require('react');\n var Select = require('./select.jsx');\n\n var data = [];\n for(var i = 0; i "
    }],
    "content": ""
  }],
  "content": ""
};

function openingTag(node) {
  var attributesStr = '';
  var attributes = Object.keys(node.attributes);

  if (attributes.length) {
    attributesStr = ' ' + attributes.map(function (attribute) {
      return attribute + '="' + node.attributes[attribute] + '"';
    }).join(' ');
  }

  return '<' + node.name + attributesStr + '>';
}

function closingTag(node) {
  return '</' + node.name + '>';
}

var unshift = Array.prototype.unshift;

/**
 * Build xml string from xml-parser's tree
 * @param root {Object}
 */
function buildXML(root) {
  var stack = Array.isArray(root) ? root : [root];
  var result = [];
  var node;

  while ((node = stack.shift())) {
    if (typeof node === 'string') {
      result.push(node);
      continue;
    }

    result.push(openingTag(node));

    stack.unshift(node.content + closingTag(node));
    unshift.apply(stack, node.children);
  }

  return result.join('');
}

//console.log(buildXML(tree));

buildXML.tree = tree;

module.exports = buildXML;
