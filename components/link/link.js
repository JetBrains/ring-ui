import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './link.css';
console.log(styles);
/**
 * @name Link
 * @category Components
 * @constructor
 * @description Displays a link.
 * @extends {ReactComponent}
 * @example
   <example name="Link">
     <file type="scss">
       .links > a {
         margin: 8px;
       }
     </file>

     <file name="index.html">
       <div id="links"></div>
     </file>

     <file name="index.js" webpack="true">
       import {render} from 'react-dom';
       import React from 'react';
       import Link from 'ring-ui/components/link/link';

       const links = (
         <div className="links">
           <Link href="#hash">Link text</Link>
           <Link href="#hash" focus={true}>Focused link</Link>
         </div>
       );

       render(links, document.getElementById('links'));
     </file>
   </example>
   <example name="Link focus">
     <file name="index.html">
       <div id="link"></div>
     </file>

     <file name="index.js" webpack="true">
       var render = require('react-dom').render;
       var Link = require('ring-ui/components/link/link');

       render(
         Link.factory({
           href: "#hash",
           focus: true
         }, 'Link text'),
         document.getElementById('link')
       );
     </file>
   </example>
 */
export default class Link extends RingComponent {
  static propTypes = {
    focus: PropTypes.bool
  }

  render() {
    const {focus, ...props} = this.props;
    const classes = classNames(styles.link, this.props.className, {
      [styles.focus]: focus
    });
    return (
      <a
        {...props}
        className={classes}
      >{this.props.children}</a>
    );
  }
}
