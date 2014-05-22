/** @jsx React.DOM */

'use strict';

var React = require('react');

var helloWorld = React.createClass({
  render: function () {
    return (
      <div className='container'>
        <h1 className='page-header'>Hello, {this.props.str}!</h1>
      </div>
      );
  }
});

module.exports = helloWorld;