/** @jsx React.DOM */

var React = require('react');
var Loader = require('../loader/loader');
require('./loader-screen.scss');

/**
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example>
   <div id="loader-screen">
   </div>

   <script>
   React.renderComponent(LoaderScreen(), document.getElementById('loader-screen'));
   </script>
   </example>
 */
var LoaderScreen = React.createClass({
  render: function() {
    return (
      <div className="ring-loader-screen">
        <Loader/>
      </div>
    );
  }
});

module.exports = LoaderScreen;
