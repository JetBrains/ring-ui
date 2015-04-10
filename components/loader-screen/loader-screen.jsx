/** @jsx React.DOM */

var React = require('react');
var Loader = require('../loader/loader');
require('./loader-screen.scss');

/**
 * @name Loader Screen
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Loader Screen">
     <file name="index.html">
       <div id="loader-screen">
       </div>
     </file>

     <file name="index.js" webpack="true">
       var React = require('react');
       var LoaderScreen = require('loader-screen/loader-screen');

       React.renderComponent(LoaderScreen(), document.getElementById('loader-screen'));
     </file>
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
