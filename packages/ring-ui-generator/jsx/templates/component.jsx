/**
 * @jsx React.DOM
 */
var React = require('react/addons');
require('./<%= componentName %>.scss');

var <%= bemName %> = React.createComponent({
  render: function () {
    return (<div/>);
  };
});

module.exports = <%= bemName %>;
