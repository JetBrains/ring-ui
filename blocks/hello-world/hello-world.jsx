/** @jsx React.DOM */

'use strict';

var React = require('react');

require('./hello-world.scss');

var helloWorld = React.createClass({
  render: function () {
    return (
      <div className='container'>
        <span className='page-header hello-world__title'>Hello</span>, <span className='hello-world__sub-title hello-world__first'>{this.props.firstPart}</span><span className='hello-world__sub-title hello-world__second'>{this.props.secondPart}</span>!
      </div>
      );
  }
});

module.exports = helloWorld;