import React from 'react';
import Loader from 'loader/loader';
import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';
import './loader-screen.scss';

/**
 * @name Loader Screen
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Loader Screen">
     <file name="index.html">
       <div id="loader-screen"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var LoaderScreen = require('loader-screen/loader-screen');

       render(
         LoaderScreen.factory(),
         document.getElementById('loader-screen')
       );
     </file>
   </example>
 */
@factory
export default class LoaderScreen extends RingComponent {
  render() {
    return (
      <div className="ring-loader-screen">
        <Loader/>
      </div>
    );
  }
}
