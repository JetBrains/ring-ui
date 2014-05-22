/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var helloWorld = require('!jsx!./blocks/hello-world/hello-world.jsx');

React.renderComponent(helloWorld({
  firstPart: 'Jet',
  secondPart: 'Brains'
}), document.getElementById('example'));