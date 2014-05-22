/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

require('hello-world.scss');

var helloWorld = React.renderComponent(
  <h1 class="hello-world__title">Hello, world!</h1>,
  document.getElementById('example')
);


module.export = helloWorld;