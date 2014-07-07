/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactTransitionGroup = require('react/addons').addons.TransitionGroup;

require('./hello-world.scss');

var url = require('./yeoman.png');

var HelloWorld = React.createClass({
  render: function () {
    return (
      <div className='container'>
        <div>
          <span className='page-header hello-world__title'>Hello</span>,
          <span className='hello-world__sub-title hello-world__first'>{this.props.firstPart}</span>
          <span className='hello-world__sub-title hello-world__second'>{this.props.secondPart}</span>!
        </div>
        <ReactTransitionGroup transitionName="fade">
          <img src={url} width="103px" height="89px" />
        </ReactTransitionGroup>
      </div>
      );
  },

  append: function (element) {

  }
});

module.exports = HelloWorld;
module.exports.helloWorld = function (params, element) {
  return React.renderComponent(HelloWorld(params), element);
};
