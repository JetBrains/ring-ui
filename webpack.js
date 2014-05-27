/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var helloWorld = require('!jsx!./blocks/hello-world/hello-world.jsx');

window['React'] = React;
module.exports = {
  'helloWorld': helloWorld
};