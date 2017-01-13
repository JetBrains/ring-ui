import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './link.css';

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
           <Link href="#hash" hover={true}>Hovered link</Link>
           <Link pseudo={true}>Pseudo link</Link>
         </div>
       );

       render(links, document.getElementById('links'));
     </file>
   </example>
 */
export default class Link extends RingComponent {
  static propTypes = {
    focus: PropTypes.bool,
    // for usage inside react-router's Link
    pseudo: PropTypes.bool
  }

  render() {
    const {hover, pseudo, ...props} = this.props;
    const Tag = pseudo ? 'span' : 'a';
    const classes = classNames(styles.link, this.props.className, {
      [styles.hover]: hover
    });
    return (
      <Tag
        {...props}
        data-test="ring-link"
        className={classes}
      >{this.props.children}</Tag>
    );
  }
}
