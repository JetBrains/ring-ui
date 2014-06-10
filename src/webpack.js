/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var helloWorld = require('!jsx!./../blocks/hello-world/hello-world.jsx');

require('./btn/_btn.scss');

window['React'] = React;
module.exports = {
  'helloWorld': helloWorld
};