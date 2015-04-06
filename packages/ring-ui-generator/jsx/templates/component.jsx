/**
 * @jsx React.DOM
 */
var React = require('react/addons');
require('./<%= bemName %>.scss');

var <%= componentName %> = React.createComponent({
  render: function () {
    return (<div/>);
  };
});

module.exports = <%= componentName %>;
