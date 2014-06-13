/** @jsx React.DOM */

'use strict';

var React = require('react');

require('./hello-world.scss');

var url = require('file!./yeoman.png');

var helloWorld = React.createClass({
  render: function () {
    return (
      <div className='container'>
        <span className='page-header hello-world__title'>Hello</span>,
        <span className='hello-world__sub-title hello-world__first'>{this.props.firstPart}</span>
        <span className='hello-world__sub-title hello-world__second'>{this.props.secondPart}</span>
        <img src={url}/>
      !
      </div>
      );
  },
  append: function (element) {

  }
});

module.exports = {
  helloWorld: function(params, element) {
    return React.renderComponent(helloWorld(params), element);
  }
};