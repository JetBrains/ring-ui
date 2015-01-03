/** @jsx React.DOM */

var React = require('react');
var Loader = require('../loader/loader');  // jshint -W098
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
    /*jshint ignore:start*/
    return (
      <div className="ring-loader-screen">
        <Loader/>
      </div>
    );
    /*jshint ignore:end*/
  }
});

module.exports = LoaderScreen;
