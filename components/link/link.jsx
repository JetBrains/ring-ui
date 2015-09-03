import React from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';
import './link.scss';

/**
 * @name Link
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Link">
     <file name="index.html">
       <div id="link"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Link = require('link/link');

       render(
         Link.factory({href: "#hash"}, 'Link text'),
         document.getElementById('link')
       );
     </file>
   </example>
 */
@factory
export default class Link extends RingComponent {
  render() {
    let classes = classNames('ring-link', this.props.className);
    return <a {...this.props} className={classes}>{this.props.children}</a>;
  }
}
